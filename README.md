# pf-2026 — portfolio (josbert.dev)

Full-stack personal portfolio. A prerendered Vite/React SPA whose content lives
in MySQL and is served by a small API, with static assets offloadable to
Cloudflare R2.

```
web (nginx, prerendered)  ──/api──►  api (Hono/Node)  ──►  MySQL
   │                                    └─ seeds from src/data/work-projects.json
   └─ /work-clone/* ─ (optional) ─► R2 / CDN
minio = local R2 (dev) · adminer = MySQL UI
```

## Stack

- **Frontend**: Vite 6 + React 19 + TypeScript + Tailwind v4. Routes `/` and
  `/work` are **prerendered to static HTML** with [`vite-react-ssg`] for SEO.
- **API**: [Hono] on Node, exposes `GET /api/content` (+ `/api/health`).
- **DB**: MySQL 8 — source of truth for portfolio content.
- **Storage**: any S3-compatible bucket. MinIO stands in for Cloudflare R2 in dev.

## Quick start (Docker)

```bash
cp .env.example .env      # adjust ports/secrets if needed
docker compose up -d --build
```

| Service | URL (default ports) |
|---|---|
| Web (site) | http://localhost:8090 |
| Web `/work` | http://localhost:8090/work |
| API | http://localhost:3011/api/content |
| Adminer (DB UI) | http://localhost:8091 |
| MinIO console | http://localhost:9101 |

Ports live in `.env` (`WEB_PORT`, `API_PORT`, `DB_PORT_HOST`, `ADMINER_PORT`,
`MINIO_PORT`, `MINIO_CONSOLE_PORT`). Stop with `docker compose down` (add `-v` to
wipe MySQL/MinIO data).

## Local dev (without Docker)

```bash
bun install
# 1) API (needs a MySQL reachable via server/ env, or just run the DB from compose)
cd server && bun install && bun run dev      # :3001
# 2) Frontend (proxies /api → :3001)
bun run dev                                   # vite-react-ssg dev
```

## Content (MySQL)

- Schema: `db/init/01-schema.sql` (loaded on first MySQL boot).
- The API **auto-seeds** from `src/data/work-projects.json` the first time the
  tables are empty (`server/src/seed.ts`), then serves the exact same shape.
- Edit content from the CMS at `/admin` (or Adminer/SQL); the site picks it up
  on next load — no rebuild. The bundled JSON is only the prerender/offline
  fallback.
- Later schema changes are applied by the API on boot (`server/src/migrate.ts`,
  idempotent), since `db/init` only runs on a fresh volume.

## CMS (`/admin`)

Single-admin panel (lazy-loaded chunk, `noindex`) to edit:

| Tab | Source | Stored in |
| --- | --- | --- |
| Work | projects, notable work, side quests, labels | `projects`, `project_notable_work`, `side_quests`, `content_meta` |
| Home / About / Footer | page copy | `site_content` (one JSON doc per key; defaults in `src/data/site-content.json`) |

- **Login**: the first admin is created on API boot from `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` (only if no admin exists). Session = HttpOnly `pf_session`
  cookie (`path=/api`, `Secure` in production, 30 days), stored hashed in
  `admin_sessions`. Login is throttled (5 failures / 15 min per IP).
- **Images**: "Subir imagen" posts to `/api/admin/uploads` (PNG/JPEG/GIF/WebP/AVIF
  by magic bytes, ≤ 8 MB). With `R2_*` **and** `UPLOADS_PUBLIC_URL` set they go
  to R2; otherwise to the API's `uploads-data` volume, served at `/api/uploads/*`.
- **/work layout**: it's a fixed Framer composition bound by position, so it
  renders the first 4 projects and 5 side quests in panel order. Extra rows are
  kept but not shown.
- Pages render the bundled defaults first (SSG), then swap in the CMS copy;
  missing fields fall back to the defaults.

API: `POST /api/auth/login|logout`, `GET /api/auth/me`; under `/api/admin/*`
(session required, JSON or multipart only): `GET/POST /projects`,
`PUT/DELETE /projects/:id`, `PUT /projects/order`, same for `/side-quests`,
`PUT /meta`, `GET/PUT /site/:key`, `POST /uploads`. Public: `GET /api/content`,
`GET /api/site/:key`, `GET /api/uploads/*`.

## Languages (EN / ES)

- English at `/`, `/work`, `/about`; Spanish at `/es`, `/es/work`, `/es/about`. Both are prerendered, with `hreflang` alternates and `<html lang>`.
- **Detection (nginx, `nginx.conf`):** on the English pages, the `lang` cookie wins (set by the EN/ES switcher in the top-right corner). With no cookie, a browser whose first `Accept-Language` is Spanish gets a 302 to `/es…`. Crawlers (no header) stay on English. Vite dev has no nginx, so there you open `/es` by hand.
- **Content:** page documents are stored as `home`, `home:es`…; projects and side quests keep translations in an `i18n` JSON column; work titles/labels are `title:es`… in `content_meta`. Empty translated fields fall back to English. Edit them in `/admin` with the EN / ES toggle.
- Bundled translations: `src/data/site-content.es.json` and the `i18n` keys in `src/data/work-projects.json`. On boot the API backfills them only where nothing is stored yet.
- Interface strings (menu, 404) live in `src/lib/i18n.tsx`.

## Assets / R2

Portfolio images live under `public/work-clone/`. To serve them from R2/CDN:

```bash
set -a; . ./.env; set +a
bun run sync-assets            # uploads public/work-clone/** to the bucket
```

Then set `ASSET_BASE_URL` (e.g. your R2 public URL) and redeploy `web`: nginx
302-redirects `/work-clone/*` to that base. Empty `ASSET_BASE_URL` = served from
the bundle. For real R2, point `R2_ENDPOINT` at
`https://<account>.r2.cloudflarestorage.com`.

## SEO

- Per-route `<title>`, description, canonical and Open Graph via `vite-react-ssg`
  `Head` (see `src/App.tsx`, `src/views/WorkPage.tsx`).
- `public/robots.txt` and `public/sitemap.xml`.
- Because pages are prerendered, crawlers get fully-rendered HTML.
- Social preview: `public/og-image.png` (1200×630). Unknown routes get a
  prerendered `404.html` with a real 404 status (nginx `error_page`).
- Canonical domain: `josbert.dev` — build fallback in `src/lib/site.ts` +
  `vite.config.ts`; also in `public/sitemap.xml` and `public/robots.txt`.
  Override per-build with `VITE_SITE_URL` (compose passes it automatically).

## Scripts

| Command | What |
|---|---|
| `bun run dev` | Dev server (SSG dev mode) |
| `bun run build` | Typecheck + prerendered production build → `dist/` |
| `bun run build:spa` | Plain SPA build (no prerender) |
| `bun run typecheck` | `tsc -b` |
| `bun run sync-assets` | Upload assets to R2/MinIO |
| `bun run db:backup` | Dump MySQL → `backups/*.sql.gz` |
| `bun run db:restore <file>` | Restore a dump |

## Ops

- **Backups**: `bun run db:backup` writes a gzipped dump to `backups/`
  (gitignored). Restore with `bun run db:restore backups/<file>.sql.gz`.
- **CI** (`.github/workflows/ci.yml`): on push/PR runs `typecheck` + prerender
  `build`, and builds both Docker images.

## Deploy (production)

Self-contained prod stack with automatic HTTPS via Caddy — only 80/443 are
exposed; DB/API are internal; assets come from R2.

```bash
cp .env.prod.example .env.prod     # set DOMAIN, strong DB passwords, R2 config
# DNS: point DOMAIN's A/AAAA record at the host, then:
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
bash scripts/smoke-test.sh          # optional post-deploy check (uses WEB_PORT)
```

Caddy fetches a Let's Encrypt cert for `$DOMAIN` automatically. Upload assets
once with `bun run sync-assets` (R2 creds in `.env.prod`) and set `ASSET_BASE_URL`
to the bucket's public URL.

## Notes

- Sections exported from Framer are machine-generated (huge single-line JSX +
  hashed CSS). They carry a `// @ts-nocheck` header — Vite/esbuild still builds
  them; they're just not hand-typechecked. Everything else is strict.
- The seeded works (Bash/Pulse/Heygo/Dotslash + side quests) come from a cloned
  template and are placeholders for real content.

[`vite-react-ssg`]: https://github.com/Daydreamer-riri/vite-react-ssg
[Hono]: https://hono.dev
