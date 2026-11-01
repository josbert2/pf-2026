import fallback from "../data/work-projects.json";
import type { Lang } from "./i18n";

export interface Project {
  id: string;
  name: string;
  url?: string | null;
  tagline?: string | null;
  tagline_l1?: string | null;
  tagline_l2?: string | null;
  tagline_l3?: string | null;
  lesson?: string | null;
  notable_work?: string[];
  highlight?: string | null;
  year?: string | null;
  image_url?: string | null;
  i18n?: Record<string, Partial<Omit<Project, "i18n" | "id">>>;
}

export interface SideQuest {
  id: string;
  name: string;
  tag?: string | null;
  repo_url?: string | null;
  role?: string | null;
  description?: string | null;
  url?: string | null;
  year?: string | null;
  image_url?: string | null;
  i18n?: Record<string, Partial<Omit<SideQuest, "i18n" | "id">>>;
}

export interface Content {
  title: string;
  labels: { notable_work: string; side_quests: string };
  projects: Project[];
  side_quests: SideQuest[];
  i18n?: Record<string, { title?: string; labels?: Partial<Content["labels"]> }>;
}

const nonEmpty = <T extends object>(o: T | undefined): Partial<T> =>
  Object.fromEntries(
    Object.entries(o ?? {}).filter(([, v]) => v !== "" && v != null && !(Array.isArray(v) && !v.length)),
  ) as Partial<T>;

/** Overlay the translations for `lang`; untranslated fields stay English. */
export function localizeContent(c: Content, lang: Lang): Content {
  if (lang === "en") return c;
  const t = c.i18n?.[lang];
  return {
    ...c,
    title: t?.title || c.title,
    labels: { ...c.labels, ...nonEmpty(t?.labels) },
    projects: c.projects.map((p) => ({ ...p, ...nonEmpty(p.i18n?.[lang]) })),
    side_quests: c.side_quests.map((q) => ({ ...q, ...nonEmpty(q.i18n?.[lang]) })),
  };
}

/** Bundled content — used for prerender/SSG and as an offline fallback. */
export const fallbackContent = fallback as Content;

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

/** Live content from the API (MySQL). Falls back to the bundled JSON. */
export async function fetchContent(signal?: AbortSignal): Promise<Content> {
  try {
    const res = await fetch(`${API_URL}/content`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Content;
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("[content] API unavailable, using bundled fallback", err);
    }
    return fallbackContent;
  }
}
