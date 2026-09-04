#!/usr/bin/env bash
# Restore a gzipped dump into the portfolio MySQL database.
# Usage: scripts/db-restore.sh backups/portfolio-YYYYMMDD-HHMMSS.sql.gz
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

file="${1:?usage: db-restore.sh <backup.sql.gz>}"
[ -f "$file" ] || { echo "Not found: $file" >&2; exit 1; }

gunzip -c "$file" \
  | docker compose exec -T mysql \
      mysql -u root -p"${DB_ROOT_PASSWORD}" "${DB_NAME}"

echo "Restored from $file"
