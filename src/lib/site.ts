// Public site origin. VITE_SITE_URL comes in as a Docker build arg
// (docker-compose*.yml); vite.config.ts guarantees a fallback for local builds.
export const SITE_URL: string =
  import.meta.env.VITE_SITE_URL ?? "https://josbert.dev";
