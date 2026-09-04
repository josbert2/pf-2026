import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";
import type { Content, Project, SideQuest } from "./types.js";

/**
 * Rebuild the exact JSON shape the frontend (WorkFull) expects, straight
 * from MySQL. Null columns are dropped so the payload matches the original
 * work-projects.json as closely as possible.
 */
export async function getContent(): Promise<Content> {
  const [metaRows] = await pool.query<RowDataPacket[]>("SELECT `key`, `value` FROM content_meta");
  const meta: Record<string, string> = {};
  for (const row of metaRows) meta[row.key] = row.value;

  const [projectRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM projects ORDER BY sort_order ASC, id ASC",
  );
  const [nwRows] = await pool.query<RowDataPacket[]>(
    "SELECT project_id, label FROM project_notable_work ORDER BY sort_order ASC, id ASC",
  );
  const [sqRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM side_quests ORDER BY sort_order ASC, id ASC",
  );

  const projects: Project[] = projectRows.map((r) => {
    const notable = nwRows.filter((n) => n.project_id === r.id).map((n) => n.label as string);
    const p: Project = { id: r.slug, name: r.name };
    if (r.url) p.url = r.url;
    if (r.tagline) p.tagline = r.tagline;
    if (r.tagline_l1) p.tagline_l1 = r.tagline_l1;
    if (r.tagline_l2) p.tagline_l2 = r.tagline_l2;
    if (r.tagline_l3) p.tagline_l3 = r.tagline_l3;
    if (r.lesson) p.lesson = r.lesson;
    if (r.highlight) p.highlight = r.highlight;
    if (r.year) p.year = r.year;
    if (notable.length) p.notable_work = notable;
    return p;
  });

  const side_quests: SideQuest[] = sqRows.map((r) => ({
    id: r.slug,
    name: r.name,
    role: r.role ?? null,
    description: r.description ?? null,
    url: r.url ?? null,
    year: r.year ?? null,
  }));

  return {
    title: meta.title ?? "",
    labels: {
      notable_work: meta.label_notable_work ?? "Notable work",
      side_quests: meta.label_side_quests ?? "Side Quests",
    },
    projects,
    side_quests,
  };
}
