import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { getPool } from "./pool.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");
  const pool = getPool();
  console.log("Running migration against DATABASE_URL...");
  await pool.query(sql);
  console.log("✓ Migration complete — users & trips tables are ready.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
