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

check "home (prerendered)"   "$base/"              "voidowl"
check "work (prerendered)"   "$base/work"          "Side Quest"
check "api health via web"   "$base/api/health"    "ok"
check "api content (MySQL)"  "$base/api/content"   "projects"
check "robots.txt"           "$base/robots.txt"
check "sitemap.xml"          "$base/sitemap.xml"

[ "$fail" -eq 0 ] && echo "smoke: all passed" || echo "smoke: FAILURES"
exit $fail
