import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { pool, waitForDb } from "./db.js";
import { seedIfEmpty } from "./seed.js";
import { getContent } from "./content.js";
import { parseLang } from "./lang.js";
import { migrate } from "./migrate.js";
import { ensureAdmin } from "./auth.js";
import { adminRoutes, authRoutes } from "./admin.js";
import { SITE_KEYS, getSiteContent } from "./site.js";
import { BadRequest } from "./validate.js";
import { CONTENT_TYPE_BY_EXT, readDiskUpload, storageDriver } from "./storage.js";

const app = new Hono();

// Public read endpoints can be called from anywhere; admin/auth only from the
// site itself (same origin via nginx / Vite proxy), so no CORS for those.
app.use("/api/content", cors({ origin: (process.env.CORS_ORIGIN ?? "*").split(",") }));
app.use("/api/site/*", cors({ origin: (process.env.CORS_ORIGIN ?? "*").split(",") }));
app.use("/api/admin/*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});

app.get("/api/health", async (c) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return c.json({ status: "ok" });
  } catch {
    return c.json({ status: "db-unavailable" }, 503);
  }
});

// Whole payload for the work page, straight from MySQL.
app.get("/api/content", async (c) => {
  const content = await getContent();
  return c.json(content);
});

// Page documents (home, about).
app.get("/api/site/:key", async (c) => {
  const key = c.req.param("key");
  if (!SITE_KEYS.includes(key)) return c.json({ error: "unknown key" }, 404);
  return c.json(await getSiteContent(key, parseLang(c.req.query("lang"))));
});

// Disk-stored CMS uploads (dev / no-R2 setups). Names are random, so cache forever.
app.get("/api/uploads/*", async (c) => {
  const rel = c.req.path.replace(/^\/api\/uploads\//, "");
  const ext = rel.split(".").pop()?.toLowerCase() ?? "";
  const type = CONTENT_TYPE_BY_EXT[ext];
  const buf = type ? await readDiskUpload(rel) : null;
  if (!buf) return c.json({ error: "not found" }, 404);
  return c.body(new Uint8Array(buf), 200, {
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
});

app.route("/api/auth", authRoutes);
app.route("/api/admin", adminRoutes);

app.onError((err, c) => {
  if (err instanceof BadRequest || err instanceof SyntaxError) {
    return c.json({ error: err.message }, 400);
  }
  if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
    return c.json({ error: "slug already exists" }, 409);
  }
  console.error("[api]", err);
  return c.json({ error: "internal error" }, 500);
});

const port = Number(process.env.PORT ?? 3001);

async function main() {
  await waitForDb();
  await migrate();
  await seedIfEmpty();
  await ensureAdmin();
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`[api] listening on :${info.port} (uploads: ${storageDriver})`);
  });
}

main().catch((err) => {
  console.error("[api] fatal", err);
  process.exit(1);
});
