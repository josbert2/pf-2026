import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { join, normalize } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Where CMS uploads go:
 *  - S3/R2 when R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *    and UPLOADS_PUBLIC_URL are set (prod: Cloudflare R2 + its public URL).
 *  - Otherwise the local disk (UPLOADS_DIR), served by the API at /api/uploads.
 */
const {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_REGION = "auto",
  UPLOADS_PUBLIC_URL,
} = process.env;

export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "/app/uploads";
const useS3 = Boolean(R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && UPLOADS_PUBLIC_URL);

const s3 = useS3
  ? new S3Client({
      endpoint: R2_ENDPOINT,
      region: R2_REGION,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY! },
      forcePathStyle: true,
    })
  : null;

export const storageDriver = useS3 ? "s3" : "disk";

// Only raster images: identified by magic bytes, never by the client's claim.
// (SVG is excluded on purpose — it can carry scripts.)
const SIGNATURES: Array<{ type: string; ext: string; test: (b: Buffer) => boolean }> = [
  { type: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/gif", ext: "gif", test: (b) => b.subarray(0, 6).toString("ascii").startsWith("GIF8") },
  { type: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  { type: "image/avif", ext: "avif", test: (b) => b.subarray(4, 12).toString("ascii") === "ftypavif" },
];

export function sniffImage(buf: Buffer) {
  return SIGNATURES.find((s) => s.test(buf)) ?? null;
}

export const CONTENT_TYPE_BY_EXT: Record<string, string> = Object.fromEntries(
  SIGNATURES.map((s) => [s.ext, s.type]),
);

/** Stores an already-validated image and returns its public URL. */
export async function saveImage(buf: Buffer, kind: { type: string; ext: string }): Promise<string> {
  const now = new Date();
  const key = `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomBytes(9).toString("base64url")}.${kind.ext}`;

  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buf,
        ContentType: kind.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return `${UPLOADS_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
  }

  const path = join(UPLOADS_DIR, key.replace(/^uploads\//, ""));
  await mkdir(join(path, ".."), { recursive: true });
  await writeFile(path, buf);
  return `/api/${key}`;
}

/** Reads a disk upload; returns null for anything outside UPLOADS_DIR. */
export async function readDiskUpload(relPath: string): Promise<Buffer | null> {
  const safe = normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  if (safe.includes("..")) return null;
  try {
    return await readFile(join(UPLOADS_DIR, safe));
  } catch {
    return null;
  }
}
