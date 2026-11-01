#!/usr/bin/env bash
# Post-deploy smoke test: hits the running stack (via WEB_PORT) and asserts the
# key endpoints respond with expected content. Exit non-zero on any failure.
set -uo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

base="http://localhost:${WEB_PORT:-8090}"
fail=0

check() { # name url [needle]
  local name="$1" url="$2" needle="${3:-}"
  local code
  code=$(curl -s -o /tmp/smoke.out -w "%{http_code}" "$url" || echo 000)
  if [ "$code" != "200" ]; then echo "FAIL $name: HTTP $code"; fail=1; return; fi
  if [ -n "$needle" ] && ! grep -q "$needle" /tmp/smoke.out; then
    echo "FAIL $name: missing '$needle'"; fail=1; return
  fi
  echo "OK   $name"
}

check "home (prerendered)"   "$base/"              "josbert"
check "work (prerendered)"   "$base/work"          "Side Quest"
check "home es (prerendered)" "$base/es"            "lang=\"es\""
check "work es (prerendered)" "$base/es/work"       "Proyectos paralelos"
check "api site/home?lang=es" "$base/api/site/home?lang=es" "Ingeniero"
check "api health via web"   "$base/api/health"    "ok"
check "api content (MySQL)"  "$base/api/content"   "projects"
check "api site/home (CMS)"  "$base/api/site/home"    "headline"
check "admin panel shell"    "$base/admin"          "noindex"

# Admin API must reject anonymous requests.
code=$(curl -s -o /dev/null -w "%{http_code}" "$base/api/admin/projects")
if [ "$code" = "401" ]; then echo "OK   admin api requires login"; else echo "FAIL admin api requires login: HTTP $code"; fail=1; fi

check "robots.txt"           "$base/robots.txt"
check "sitemap.xml"          "$base/sitemap.xml"

[ "$fail" -eq 0 ] && echo "smoke: all passed" || echo "smoke: FAILURES"
exit $fail
