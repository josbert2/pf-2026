import { BadRequest } from "./validate.js";

/** Site languages. English is the base; the others overlay translations on it. */
export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const TRANSLATED: Lang[] = LANGS.filter((l) => l !== "en");

/** `?lang=` → Lang. Missing means English; anything unknown is a 400. */
export function parseLang(v: string | undefined): Lang {
  if (!v) return "en";
  if (!(LANGS as readonly string[]).includes(v)) throw new BadRequest(`lang must be one of ${LANGS.join(", ")}`);
  return v as Lang;
}

// Fields a project / side quest can translate. Everything else (slug, urls,
// images, year, name) is shared across languages.
export const PROJECT_I18N = ["tagline", "tagline_l1", "tagline_l2", "tagline_l3", "lesson", "highlight"] as const;
export const PROJECT_I18N_LISTS = ["notable_work"] as const;
export const SQ_I18N = ["tag", "role", "description"] as const;

/**
 * Validate an `i18n` body field ({ es: { field: "…" } }) and return it as a
 * JSON string for the column. Empty values are dropped so they fall back to
 * English on the site.
 */
export function i18nColumn(
  raw: unknown,
  fields: readonly string[],
  lists: readonly string[] = [],
): string | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) throw new BadRequest("i18n must be an object");
  const src = raw as Record<string, unknown>;
  const out: Record<string, Record<string, string | string[]>> = {};
  for (const lang of TRANSLATED) {
    const t = src[lang];
    if (t === undefined || t === null) continue;
    if (typeof t !== "object" || Array.isArray(t)) throw new BadRequest(`i18n.${lang} must be an object`);
    const o: Record<string, string | string[]> = {};
    for (const f of fields) {
      const v = (t as Record<string, unknown>)[f];
      if (v === undefined || v === null || v === "") continue;
      if (typeof v !== "string") throw new BadRequest(`i18n.${lang}.${f} must be a string`);
      if (v.trim().length > 2000) throw new BadRequest(`i18n.${lang}.${f} is too long (max 2000)`);
      if (v.trim()) o[f] = v.trim();
    }
    for (const f of lists) {
      const v = (t as Record<string, unknown>)[f];
      if (v === undefined || v === null) continue;
      if (!Array.isArray(v) || v.some((x) => typeof x !== "string" || x.length > 255)) {
        throw new BadRequest(`i18n.${lang}.${f} must be an array of short strings`);
      }
      const items = (v as string[]).map((x) => x.trim()).filter(Boolean);
      if (items.length) o[f] = items;
    }
    out[lang] = o;
  }
  return JSON.stringify(out);
}
