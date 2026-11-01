import { readFileSync, existsSync } from "node:fs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./db.js";
import type { Content } from "./types.js";

/** Candidate locations for the seed JSON (docker image vs. local dev). */
const SEED_CANDIDATES = [
  process.env.SEED_FILE,
  "/app/seed-data.json",
  new URL("../../src/data/work-projects.json", import.meta.url).pathname,
].filter(Boolean) as string[];

function loadSeed(): Content | null {
  for (const path of SEED_CANDIDATES) {
    if (existsSync(path)) {
      console.log(`[seed] reading ${path}`);
      return JSON.parse(readFileSync(path, "utf-8")) as Content;
    }
  }
  return null;
}

/**
 * Populate MySQL from the bundled JSON the first time the DB is empty.
 * Idempotent: if `projects` already has rows, it does nothing.
 */
export async function seedIfEmpty(): Promise<void> {
  const data = loadSeed();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM projects");
  if (Number(rows[0].n) > 0) {
    console.log("[seed] projects already present, skipping");
    if (data) await backfillTranslations(data);
    return;
  }

  if (!data) {
    console.warn("[seed] no seed file found, leaving DB empty");
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query("INSERT INTO content_meta (`key`, `value`) VALUES (?, ?), (?, ?), (?, ?)", [
      "title", data.title ?? "",
      "label_notable_work", data.labels?.notable_work ?? "Notable work",
      "label_side_quests", data.labels?.side_quests ?? "Side Quests",
    ]);
    for (const [key, value] of metaTranslations(data)) {
      await conn.query("INSERT INTO content_meta (`key`, `value`) VALUES (?, ?)", [key, value]);
    }

    let pOrder = 0;
    for (const p of data.projects ?? []) {
      const [res] = await conn.query(
        `INSERT INTO projects
           (slug, name, url, tagline, tagline_l1, tagline_l2, tagline_l3, lesson, highlight, year, image_url, i18n, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.name, p.url ?? null, p.tagline ?? null,
          p.tagline_l1 ?? null, p.tagline_l2 ?? null, p.tagline_l3 ?? null,
          p.lesson ?? null, p.highlight ?? null, p.year ?? null, p.image_url ?? null,
          p.i18n ? JSON.stringify(p.i18n) : null, pOrder++,
        ],
      );
      const projectId = (res as { insertId: number }).insertId;
      let nOrder = 0;
      for (const label of p.notable_work ?? []) {
        await conn.query(
          "INSERT INTO project_notable_work (project_id, label, sort_order) VALUES (?, ?, ?)",
          [projectId, label, nOrder++],
        );
      }
    }

    let sOrder = 0;
    for (const s of data.side_quests ?? []) {
      await conn.query(
        `INSERT INTO side_quests (slug, name, tag, role, description, url, repo_url, image_url, year, i18n, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id, s.name, s.tag ?? null, s.role ?? null, s.description ?? null, s.url ?? null,
          s.repo_url ?? null, s.image_url ?? null, s.year ?? null,
          s.i18n ? JSON.stringify(s.i18n) : null, sOrder++,
        ],
      );
    }

    await conn.commit();
    console.log("[seed] done");
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/** content_meta rows for the translated title/labels ("title:es"…). */
function metaTranslations(data: Content): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [lang, t] of Object.entries(data.i18n ?? {})) {
    if (t.title) out.push([`title:${lang}`, t.title]);
    if (t.labels?.notable_work) out.push([`label_notable_work:${lang}`, t.labels.notable_work]);
    if (t.labels?.side_quests) out.push([`label_side_quests:${lang}`, t.labels.side_quests]);
  }
  return out;
}

/**
 * DBs seeded before translations existed: fill in the bundled translations
 * where nothing is stored yet. Rows edited in the panel always have a
 * non-NULL i18n, so this never overwrites the admin's work.
 */
async function backfillTranslations(data: Content): Promise<void> {
  let n = 0;
  for (const [table, items] of [["projects", data.projects ?? []], ["side_quests", data.side_quests ?? []]] as const) {
    for (const item of items) {
      if (!item.i18n) continue;
      const [res] = await pool.query<ResultSetHeader>(
        `UPDATE ${table} SET i18n = ? WHERE slug = ? AND i18n IS NULL`,
        [JSON.stringify(item.i18n), item.id],
      );
      n += res.affectedRows;
    }
  }
  for (const [key, value] of metaTranslations(data)) {
    const [res] = await pool.query<ResultSetHeader>("INSERT IGNORE INTO content_meta (`key`, `value`) VALUES (?, ?)", [key, value]);
    n += res.affectedRows;
  }
  if (n) console.log(`[seed] backfilled ${n} translation(s)`);
}
