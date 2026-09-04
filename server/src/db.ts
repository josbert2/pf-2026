import mysql from "mysql2/promise";

/**
 * Single shared connection pool. Config comes from env so the same image
 * runs against the compose MySQL, a managed DB, etc.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "portfolio",
  password: process.env.DB_PASSWORD ?? "portfolio",
  database: process.env.DB_NAME ?? "portfolio",
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
});

/** Wait for MySQL to accept connections (compose starts them in parallel). */
export async function waitForDb(retries = 30, delayMs = 2000): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`[db] not ready yet (${i}/${retries}), retrying in ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
