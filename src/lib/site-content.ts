import { useEffect, useState } from "react";
import defaults from "../data/site-content.json";
import esDefaults from "../data/site-content.es.json";
import { useLang, type Lang } from "./i18n";

export type SiteDefaults = typeof defaults;
export type HomeContent = SiteDefaults["home"];
export type AboutContent = SiteDefaults["about"];
export type FooterContent = SiteDefaults["footer"];
export type SiteKey = keyof SiteDefaults;

export const siteDefaults: SiteDefaults = defaults;

/** Bundled translations; partial, anything missing falls back to English. */
const translations: Record<Exclude<Lang, "en">, { [K in SiteKey]?: Partial<SiteDefaults[K]> }> = {
  es: esDefaults as { [K in SiteKey]?: Partial<SiteDefaults[K]> },
};

/** English defaults with the bundled translation for `lang` on top. */
export function localDefaults<K extends SiteKey>(key: K, lang: Lang): SiteDefaults[K] {
  return lang === "en" ? siteDefaults[key] : { ...siteDefaults[key], ...translations[lang][key] };
}

/** Drop empty strings/lists so an untranslated field shows English instead. */
export function filled<T extends object>(doc: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(doc).filter(([, v]) => v !== "" && v !== null && !(Array.isArray(v) && v.length === 0)),
  ) as Partial<T>;
}

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

// One request per key+language per page load, shared by every component that asks.
const inflight = new Map<string, Promise<unknown>>();

function load<K extends SiteKey>(key: K, lang: Lang): Promise<Partial<SiteDefaults[K]>> {
  const id = `${key}:${lang}`;
  if (!inflight.has(id)) {
    inflight.set(
      id,
      fetch(`${API_URL}/site/${key}${lang === "en" ? "" : `?lang=${lang}`}`)
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    );
  }
  return inflight.get(id) as Promise<Partial<SiteDefaults[K]>>;
}

/**
 * Page copy from the CMS. Renders the bundled defaults first (SSG/prerender
 * and offline), then swaps in whatever the API returns. Missing fields keep
 * their default, so a half-filled document never blanks the page.
 */
export function useSiteContent<K extends SiteKey>(key: K): SiteDefaults[K] {
  const lang = useLang();
  const [content, setContent] = useState<SiteDefaults[K]>(() => localDefaults(key, lang));
  useEffect(() => {
    let alive = true;
    load(key, lang).then((remote) => {
      if (alive && remote && typeof remote === "object") {
        // English shows exactly what was saved; a translation falls back field by field.
        setContent({ ...localDefaults(key, lang), ...(lang === "en" ? remote : filled(remote)) });
      }
    });
    return () => {
      alive = false;
    };
  }, [key, lang]);
  return content;
}

/** Forget cached documents (the admin panel calls this after saving). */
export function invalidateSiteContent(key?: SiteKey) {
  for (const id of [...inflight.keys()]) {
    if (!key || id.startsWith(`${key}:`)) inflight.delete(id);
  }
}
