import { existsSync, readFileSync } from "node:fs";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";
import type { Lang } from "./lang.js";

/** Editable page documents. Each is one JSON object in `site_content`. */
export const SITE_KEYS = ["home", "about", "footer"];

// English lives in site-content.json, translations in site-content.<lang>.json.
function defaultsCandidates(lang: Lang): string[] {
  const suffix = lang === "en" ? "" : `.${lang}`;
  return [
    lang === "en" ? process.env.SITE_DEFAULTS_FILE : undefined,
    `/app/site-defaults${suffix}.json`,
    new URL(`../../src/data/site-content${suffix}.json`, import.meta.url).pathname,
  ].filter(Boolean) as string[];
}

function loadDefaults(lang: Lang): Record<string, Record<string, unknown>> {
  for (const path of defaultsCandidates(lang)) {
    if (existsSync(path)) return JSON.parse(readFileSync(path, "utf-8"));
  }
  return {};
}

/** Row key: "home" for English, "home:es" for a translation. */
const rowKey = (key: string, lang: Lang) => (lang === "en" ? key : `${key}:${lang}`);

/**
 * Stored document, falling back to the bundled defaults for that key and
 * language. Translations come back partial; the client fills the gaps with
 * English.
 */
export async function getSiteContent(key: string, lang: Lang = "en"): Promise<Record<string, unknown>> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT `value` FROM site_content WHERE `key` = ?", [
    rowKey(key, lang),
  ]);
  if (rows[0]) {
    const v = rows[0].value;
    return typeof v === "string" ? JSON.parse(v) : v;
  }
  return loadDefaults(lang)[key] ?? {};
}

export async function putSiteContent(key: string, value: Record<string, unknown>, lang: Lang = "en"): Promise<void> {
  await pool.query(
    "INSERT INTO site_content (`key`, `value`) VALUES (?, CAST(? AS JSON)) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
    [rowKey(key, lang), JSON.stringify(value)],
  );
}
