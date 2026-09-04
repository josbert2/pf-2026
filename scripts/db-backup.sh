#!/usr/bin/env bash
# Dump the portfolio MySQL database to backups/ (gzip). Reads creds from .env.
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

mkdir -p backups
ts=$(date +%Y%m%d-%H%M%S)
out="backups/${DB_NAME}-${ts}.sql.gz"

docker compose exec -T mysql \
  mysqldump -u root -p"${DB_ROOT_PASSWORD}" --single-transaction "${DB_NAME}" \
  | gzip > "$out"

echo "Backup written: $out"
