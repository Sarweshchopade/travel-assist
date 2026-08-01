import pg from "pg";

const { Pool } = pg;

let pool = null;

export function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string to server/.env (see README for free hosting options like Neon or Supabase)."
    );
  }

  pool = new Pool({
    connectionString,
    // Most hosted Postgres providers (Neon, Supabase, Render) require SSL
    // but use certs that Node doesn't recognize by default in this simple setup.
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
  });

  return pool;
}

export async function query(text, params) {
  const client = getPool();
  return client.query(text, params);
}
