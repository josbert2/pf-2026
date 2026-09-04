import fallback from "../data/work-projects.json";

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
}

export interface SideQuest {
  id: string;
  name: string;
  role?: string | null;
  description?: string | null;
  url?: string | null;
  year?: string | null;
}

export interface Content {
  title: string;
  labels: { notable_work: string; side_quests: string };
  projects: Project[];
  side_quests: SideQuest[];
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
