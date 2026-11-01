import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";

/**
 * Idempotent schema changes applied on every boot. db/init/01-schema.sql only
 * runs when the MySQL volume is created, so anything added after that lives
 * here (CREATE … IF NOT EXISTS / guarded ALTERs).
 */
const TABLES = [
  `CREATE TABLE IF NOT EXISTS admin_users (
     id            INT AUTO_INCREMENT PRIMARY KEY,
     email         VARCHAR(255) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // token_hash = sha256(cookie token); the raw token never touches the DB.
  `CREATE TABLE IF NOT EXISTS admin_sessions (
     token_hash CHAR(64) PRIMARY KEY,
     user_id    INT NOT NULL,
     expires_at DATETIME NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT fk_session_user FOREIGN KEY (user_id)
       REFERENCES admin_users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // Free-form page content (home, about…) as one JSON document per key.
  `CREATE TABLE IF NOT EXISTS site_content (
     \`key\`    VARCHAR(64) PRIMARY KEY,
     \`value\`  JSON NOT NULL,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

const COLUMNS: Array<[table: string, column: string, definition: string]> = [
  ["projects", "image_url", "VARCHAR(1024) NULL"],
  ["side_quests", "image_url", "VARCHAR(1024) NULL"],
  ["side_quests", "tag", "VARCHAR(128) NULL"],
  ["side_quests", "repo_url", "VARCHAR(512) NULL"],
  // Per-language overlays: { "es": { "tagline": "…" } } (see lang.ts)
  ["projects", "i18n", "JSON NULL"],
  ["side_quests", "i18n", "JSON NULL"],
];

async function hasColumn(table: string, column: string): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return rows.length > 0;
}

export async function migrate(): Promise<void> {
  for (const sql of TABLES) await pool.query(sql);
  for (const [table, column, def] of COLUMNS) {
    if (!(await hasColumn(table, column))) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${def}`);
      console.log(`[migrate] added ${table}.${column}`);
    }
  }
}
