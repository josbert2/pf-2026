import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { pool, waitForDb } from "./db.js";
import { seedIfEmpty } from "./seed.js";
import { getContent } from "./content.js";

const app = new Hono();

app.use("/api/*", cors({ origin: (process.env.CORS_ORIGIN ?? "*").split(",") }));

app.get("/api/health", async (c) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return c.json({ status: "ok" });
  } catch {
    return c.json({ status: "db-unavailable" }, 503);
  }
});

// Whole payload for the work page, straight from MySQL.
app.get("/api/content", async (c) => {
  const content = await getContent();
  return c.json(content);
});

const port = Number(process.env.PORT ?? 3001);

async function main() {
  await waitForDb();
  await seedIfEmpty();
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`[api] listening on :${info.port}`);
  });
}

main().catch((err) => {
  console.error("[api] fatal", err);
  process.exit(1);
});
