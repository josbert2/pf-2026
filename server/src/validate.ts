/** Tiny request-body helpers — enough for a single-admin CMS without a schema lib. */
export class BadRequest extends Error {}

type Body = Record<string, unknown>;

export function asBody(v: unknown): Body {
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new BadRequest("body must be a JSON object");
  return v as Body;
}

export function str(b: Body, key: string, opts: { required?: boolean; max?: number } = {}): string | null {
  const v = b[key];
  if (v === undefined || v === null || v === "") {
    if (opts.required) throw new BadRequest(`${key} is required`);
    return null;
  }
  if (typeof v !== "string") throw new BadRequest(`${key} must be a string`);
  const t = v.trim();
  if (opts.required && !t) throw new BadRequest(`${key} is required`);
  if (opts.max && t.length > opts.max) throw new BadRequest(`${key} is too long (max ${opts.max})`);
  return t || null;
}

export function strList(b: Body, key: string, max = 255): string[] {
  const v = b[key];
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) {
    throw new BadRequest(`${key} must be an array of strings`);
  }
  return v.map((x: string) => x.trim()).filter(Boolean).map((x) => {
    if (x.length > max) throw new BadRequest(`${key} item too long (max ${max})`);
    return x;
  });
}

export function idList(b: Body, key: string): number[] {
  const v = b[key];
  if (!Array.isArray(v) || v.some((x) => !Number.isInteger(x))) {
    throw new BadRequest(`${key} must be an array of integer ids`);
  }
  return v as number[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function slug(b: Body, key = "slug"): string {
  const s = str(b, key, { required: true, max: 64 })!;
  if (!SLUG.test(s)) throw new BadRequest(`${key} must be lowercase letters, numbers and dashes`);
  return s;
}

export function url(b: Body, key: string): string | null {
  const s = str(b, key, { max: 1024 });
  if (s && !/^(https?:\/\/|\/)/.test(s)) throw new BadRequest(`${key} must be an http(s) URL or a /path`);
  return s;
}
