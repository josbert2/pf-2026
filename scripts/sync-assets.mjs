#!/usr/bin/env node
/**
 * Upload the portfolio's static assets to an S3-compatible bucket
 * (Cloudflare R2 in prod, or the local MinIO in dev).
 *
 * Usage:
 *   node scripts/sync-assets.mjs            # uploads public/work-clone/**
 *   node scripts/sync-assets.mjs public     # uploads all of public/**
 *
 * Reads config from env (.env): R2_ENDPOINT, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_REGION.
 */
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const SRC_DIR = process.argv[2] ?? "public/work-clone";
const PUBLIC_ROOT = "public";

const {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_REGION = "auto",
} = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error("Missing R2_* env vars. Load them first, e.g. `set -a; . ./.env; set +a`.");
  process.exit(1);
}
if (!existsSync(SRC_DIR)) {
  console.error(`Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".css": "text/css",
  ".json": "application/json",
  ".html": "text/html",
};

const s3 = new S3Client({
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  forcePathStyle: true, // required by MinIO; harmless for R2
});

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

let count = 0;
for (const file of walk(SRC_DIR)) {
  // Key mirrors the URL path the app requests, e.g. work-clone/images/x.png
  const key = relative(PUBLIC_ROOT, file).split("\\").join("/");
  const body = readFileSync(file);
  const ContentType = CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  count++;
  if (count % 25 === 0) console.log(`  ...${count} objects`);
}

console.log(`Uploaded ${count} objects to ${R2_BUCKET} (${R2_ENDPOINT}).`);
console.log("Set ASSET_BASE_URL to the bucket's public URL and redeploy web to serve from it.");
