import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "pf_session";
const SESSION_DAYS = 30;

// ── Passwords: scrypt$<salt hex>$<hash hex> ──────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

// ── Sessions ─────────────────────────────────────────────────────────────────
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export interface AdminUser {
  id: number;
  email: string;
}

export async function createSession(c: Context, userId: number): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await pool.query("INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [
    sha256(token),
    userId,
    expires,
  ]);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "1",
    path: "/api",
    expires,
  });
}

export async function destroySession(c: Context): Promise<void> {
  const token = getCookie(c, SESSION_COOKIE);
  if (token) await pool.query("DELETE FROM admin_sessions WHERE token_hash = ?", [sha256(token)]);
  deleteCookie(c, SESSION_COOKIE, { path: "/api" });
}

export async function sessionUser(c: Context): Promise<AdminUser | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return null;
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.email FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > NOW()`,
    [sha256(token)],
  );
  return rows[0] ? { id: rows[0].id, email: rows[0].email } : null;
}

/**
 * Guards /api/admin/*. Mutating requests must be JSON (or multipart for
 * uploads): together with SameSite=Lax this blocks cross-site form posts.
 */
export const requireAdmin: MiddlewareHandler<{ Variables: { user: AdminUser } }> = async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    const type = c.req.header("content-type") ?? "";
    if (!type.startsWith("application/json") && !type.startsWith("multipart/form-data")) {
      return c.json({ error: "unsupported content-type" }, 415);
    }
  }
  const user = await sessionUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  c.set("user", user);
  await next();
};

// ── Login throttling (per IP, in memory — single API instance) ───────────────
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function loginLocked(ip: string): boolean {
  const a = attempts.get(ip);
  return Boolean(a && a.count >= MAX_ATTEMPTS && a.until > Date.now());
}

export function recordLoginFailure(ip: string): void {
  const a = attempts.get(ip);
  const fresh = !a || a.until <= Date.now();
  attempts.set(ip, { count: fresh ? 1 : a.count + 1, until: Date.now() + LOCK_MS });
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD if none exists. */
export async function ensureAdmin(): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM admin_users");
  if (Number(rows[0].n) > 0) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("[auth] no admin user yet — set ADMIN_EMAIL and ADMIN_PASSWORD to create one");
    return;
  }
  await pool.query("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)", [
    email.toLowerCase(),
    await hashPassword(password),
  ]);
  console.log(`[auth] created admin ${email}`);
}
