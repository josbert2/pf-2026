// Thin client for the CMS API. Same-origin (Vite proxy in dev, nginx in prod),
// so the HttpOnly session cookie travels automatically.
const API = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? `HTTP ${res.status}`, res.status);
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown = {}) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path, {}),

  async upload(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/admin/uploads`, { method: "POST", credentials: "same-origin", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error ?? `HTTP ${res.status}`, res.status);
    return data.url as string;
  },
};

export interface AdminProject {
  id: number;
  slug: string;
  name: string;
  url: string | null;
  image_url: string | null;
  year: string | null;
  tagline: string | null;
  tagline_l1: string | null;
  tagline_l2: string | null;
  tagline_l3: string | null;
  lesson: string | null;
  highlight: string | null;
  notable_work: string[];
  i18n: Translations | null;
}

export interface AdminSideQuest {
  id: number;
  slug: string;
  name: string;
  tag: string | null;
  role: string | null;
  description: string | null;
  url: string | null;
  repo_url: string | null;
  image_url: string | null;
  year: string | null;
  i18n: Translations | null;
}

/** Per-language overrides of the text fields: { es: { tagline: "…" } }. */
export type Translations = Record<string, Record<string, string | string[] | null | undefined>>;
