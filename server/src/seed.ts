import { readFileSync, existsSync } from "node:fs";
import type { RowDataPacket } from "mysql2";
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
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM projects");
  if (Number(rows[0].n) > 0) {
    console.log("[seed] projects already present, skipping");
    return;
  }

  const data = loadSeed();
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

    let pOrder = 0;
    for (const p of data.projects ?? []) {
      const [res] = await conn.query(
        `INSERT INTO projects
           (slug, name, url, tagline, tagline_l1, tagline_l2, tagline_l3, lesson, highlight, year, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.name, p.url ?? null, p.tagline ?? null,
          p.tagline_l1 ?? null, p.tagline_l2 ?? null, p.tagline_l3 ?? null,
          p.lesson ?? null, p.highlight ?? null, p.year ?? null, pOrder++,
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
        `INSERT INTO side_quests (slug, name, role, description, url, year, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [s.id, s.name, s.role ?? null, s.description ?? null, s.url ?? null, s.year ?? null, sOrder++],
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
