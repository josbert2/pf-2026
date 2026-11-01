import { Hono } from "hono";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  clearLoginFailures,
  createSession,
  destroySession,
  loginLocked,
  recordLoginFailure,
  requireAdmin,
  sessionUser,
  verifyPassword,
  type AdminUser,
} from "./auth.js";
import { pool } from "./db.js";
import { PROJECT_I18N, PROJECT_I18N_LISTS, SQ_I18N, i18nColumn, parseLang } from "./lang.js";
import { SITE_KEYS, getSiteContent, putSiteContent } from "./site.js";
import { saveImage, sniffImage } from "./storage.js";
import { BadRequest, asBody, idList, slug, str, strList, url } from "./validate.js";

type Env = { Variables: { user: AdminUser } };

// Prod is Caddy → nginx → api: Caddy sets X-Forwarded-For to the real client
// (it ignores client-sent values), so its first entry is the one to trust.
const clientIp = (c: { req: { header: (h: string) => string | undefined } }) =>
  c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "local";

// ── Auth (public) ────────────────────────────────────────────────────────────
export const authRoutes = new Hono();

authRoutes.post("/login", async (c) => {
  const ip = clientIp(c);
  if (loginLocked(ip)) return c.json({ error: "too many attempts, try again later" }, 429);
  const b = asBody(await c.req.json().catch(() => null));
  const email = str(b, "email", { required: true, max: 255 })!.toLowerCase();
  const password = str(b, "password", { required: true, max: 512 })!;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, password_hash FROM admin_users WHERE email = ?",
    [email],
  );
  const ok = rows[0] && (await verifyPassword(password, rows[0].password_hash));
  if (!ok) {
    recordLoginFailure(ip);
    return c.json({ error: "invalid credentials" }, 401);
  }
  clearLoginFailures(ip);
  await createSession(c, rows[0].id);
  return c.json({ email });
});

authRoutes.post("/logout", async (c) => {
  await destroySession(c);
  return c.json({ ok: true });
});

authRoutes.get("/me", async (c) => {
  const user = await sessionUser(c);
  return user ? c.json(user) : c.json({ error: "unauthorized" }, 401);
});

// ── Admin (session required) ─────────────────────────────────────────────────
export const adminRoutes = new Hono<Env>();
adminRoutes.use("*", requireAdmin);

// Work page labels/title (?lang=es stores the translation under "title:es"…)
adminRoutes.put("/meta", async (c) => {
  const lang = parseLang(c.req.query("lang"));
  const suffix = lang === "en" ? "" : `:${lang}`;
  const b = asBody(await c.req.json());
  const entries: Array<[string, string | null]> = [
    ["title", str(b, "title", { max: 255 })],
    ["label_notable_work", str(b, "label_notable_work", { max: 128 })],
    ["label_side_quests", str(b, "label_side_quests", { max: 128 })],
  ];
  for (const [base, value] of entries) {
    const key = base + suffix;
    if (value === null) {
      // An empty translation means "use English"; English itself is never blanked.
      if (suffix) await pool.query("DELETE FROM content_meta WHERE `key` = ?", [key]);
      continue;
    }
    await pool.query(
      "INSERT INTO content_meta (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
      [key, value],
    );
  }
  return c.json({ ok: true });
});

// ── Projects ─────────────────────────────────────────────────────────────────
const PROJECT_TEXT = ["tagline", "tagline_l1", "tagline_l2", "tagline_l3", "lesson", "highlight"] as const;

function projectFields(body: unknown) {
  const b = asBody(body);
  const text = Object.fromEntries(PROJECT_TEXT.map((k) => [k, str(b, k, { max: 2000 })])) as Record<
    (typeof PROJECT_TEXT)[number],
    string | null
  >;
  return {
    slug: slug(b),
    name: str(b, "name", { required: true, max: 128 })!,
    url: url(b, "url"),
    image_url: url(b, "image_url"),
    year: str(b, "year", { max: 16 }),
    ...text,
    notable_work: strList(b, "notable_work"),
    i18n: i18nColumn(b.i18n, PROJECT_I18N, PROJECT_I18N_LISTS),
  };
}

async function loadProjects() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM projects ORDER BY sort_order, id");
  const [nw] = await pool.query<RowDataPacket[]>(
    "SELECT project_id, label FROM project_notable_work ORDER BY sort_order, id",
  );
  return rows.map((r) => ({
    ...r,
    notable_work: nw.filter((n) => n.project_id === r.id).map((n) => n.label as string),
  }));
}

async function saveNotable(conn: typeof pool | Awaited<ReturnType<typeof pool.getConnection>>, id: number, labels: string[]) {
  await conn.query("DELETE FROM project_notable_work WHERE project_id = ?", [id]);
  for (const [i, label] of labels.entries()) {
    await conn.query("INSERT INTO project_notable_work (project_id, label, sort_order) VALUES (?, ?, ?)", [id, label, i]);
  }
}

adminRoutes.get("/projects", async (c) => c.json(await loadProjects()));

adminRoutes.post("/projects", async (c) => {
  const f = projectFields(await c.req.json());
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.query<ResultSetHeader>(
      `INSERT INTO projects (slug, name, url, image_url, year, i18n, ${PROJECT_TEXT.join(", ")}, sort_order)
       SELECT ?, ?, ?, ?, ?, ?, ${PROJECT_TEXT.map(() => "?").join(", ")}, COALESCE(MAX(sort_order) + 1, 0) FROM projects`,
      [f.slug, f.name, f.url, f.image_url, f.year, f.i18n, ...PROJECT_TEXT.map((k) => f[k])],
    );
    await saveNotable(conn, res.insertId, f.notable_work);
    await conn.commit();
    return c.json({ id: res.insertId }, 201);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

adminRoutes.put("/projects/:id{[0-9]+}", async (c) => {
  const id = Number(c.req.param("id"));
  const f = projectFields(await c.req.json());
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.query<ResultSetHeader>(
      `UPDATE projects SET slug = ?, name = ?, url = ?, image_url = ?, year = ?, i18n = ?,
         ${PROJECT_TEXT.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
      [f.slug, f.name, f.url, f.image_url, f.year, f.i18n, ...PROJECT_TEXT.map((k) => f[k]), id],
    );
    if (res.affectedRows === 0) {
      await conn.rollback();
      return c.json({ error: "not found" }, 404);
    }
    await saveNotable(conn, id, f.notable_work);
    await conn.commit();
    return c.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

adminRoutes.delete("/projects/:id{[0-9]+}", async (c) => {
  const [res] = await pool.query<ResultSetHeader>("DELETE FROM projects WHERE id = ?", [Number(c.req.param("id"))]);
  return res.affectedRows ? c.json({ ok: true }) : c.json({ error: "not found" }, 404);
});

// ── Side quests ──────────────────────────────────────────────────────────────
function sideQuestFields(body: unknown) {
  const b = asBody(body);
  return {
    slug: slug(b),
    name: str(b, "name", { required: true, max: 128 })!,
    tag: str(b, "tag", { max: 128 }),
    role: str(b, "role", { max: 512 }),
    description: str(b, "description", { max: 2000 }),
    url: url(b, "url"),
    repo_url: url(b, "repo_url"),
    image_url: url(b, "image_url"),
    year: str(b, "year", { max: 16 }),
    i18n: i18nColumn(b.i18n, SQ_I18N),
  };
}
const SQ_COLS = ["slug", "name", "tag", "role", "description", "url", "repo_url", "image_url", "year", "i18n"] as const;

adminRoutes.get("/side-quests", async (c) => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM side_quests ORDER BY sort_order, id");
  return c.json(rows);
});

adminRoutes.post("/side-quests", async (c) => {
  const f = sideQuestFields(await c.req.json());
  const [res] = await pool.query<ResultSetHeader>(
    `INSERT INTO side_quests (${SQ_COLS.join(", ")}, sort_order)
     SELECT ${SQ_COLS.map(() => "?").join(", ")}, COALESCE(MAX(sort_order) + 1, 0) FROM side_quests`,
    SQ_COLS.map((k) => f[k]),
  );
  return c.json({ id: res.insertId }, 201);
});

adminRoutes.put("/side-quests/:id{[0-9]+}", async (c) => {
  const f = sideQuestFields(await c.req.json());
  const [res] = await pool.query<ResultSetHeader>(
    `UPDATE side_quests SET ${SQ_COLS.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
    [...SQ_COLS.map((k) => f[k]), Number(c.req.param("id"))],
  );
  return res.affectedRows ? c.json({ ok: true }) : c.json({ error: "not found" }, 404);
});

adminRoutes.delete("/side-quests/:id{[0-9]+}", async (c) => {
  const [res] = await pool.query<ResultSetHeader>("DELETE FROM side_quests WHERE id = ?", [Number(c.req.param("id"))]);
  return res.affectedRows ? c.json({ ok: true }) : c.json({ error: "not found" }, 404);
});

// ── Ordering (drag & drop in the panel sends the full id list) ──────────────
for (const [path, table] of [["/projects/order", "projects"], ["/side-quests/order", "side_quests"]] as const) {
  adminRoutes.put(path, async (c) => {
    const ids = idList(asBody(await c.req.json()), "ids");
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const [i, id] of ids.entries()) {
        await conn.query(`UPDATE ${table} SET sort_order = ? WHERE id = ?`, [i, id]);
      }
      await conn.commit();
      return c.json({ ok: true });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  });
}

// ── Page content (home, about) ───────────────────────────────────────────────
adminRoutes.get("/site/:key", async (c) => {
  const key = c.req.param("key");
  if (!SITE_KEYS.includes(key)) return c.json({ error: "unknown key" }, 404);
  return c.json(await getSiteContent(key, parseLang(c.req.query("lang"))));
});

adminRoutes.put("/site/:key", async (c) => {
  const key = c.req.param("key");
  if (!SITE_KEYS.includes(key)) return c.json({ error: "unknown key" }, 404);
  const lang = parseLang(c.req.query("lang"));
  const value = asBody(await c.req.json());
  await putSiteContent(key, value, lang);
  return c.json({ ok: true });
});

// ── Uploads (images only, ≤ 8 MB) ────────────────────────────────────────────
const MAX_UPLOAD = 8 * 1024 * 1024;

adminRoutes.post("/uploads", async (c) => {
  if (Number(c.req.header("content-length") ?? 0) > MAX_UPLOAD + 64 * 1024) {
    return c.json({ error: "file too large (max 8 MB)" }, 413);
  }
  const form = await c.req.parseBody();
  const file = form.file;
  if (!(file instanceof File)) return c.json({ error: "send the image in a 'file' field" }, 400);
  if (file.size > MAX_UPLOAD) return c.json({ error: "file too large (max 8 MB)" }, 413);
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return c.json({ error: "only PNG, JPEG, GIF, WebP or AVIF images" }, 415);
  return c.json({ url: await saveImage(buf, kind) }, 201);
});

export { BadRequest };
