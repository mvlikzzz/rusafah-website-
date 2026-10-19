import { config as loadEnv } from "dotenv";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv();

/** Development helper: drops and recreates the public schema. Refuses to run in production. */
async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("db:reset is disabled in production");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    await pool.query("drop schema if exists public cascade; create schema public;");
    await pool.query("drop schema if exists drizzle cascade;");
    await pool.query("drop schema if exists pgboss cascade;");
    console.log("database reset");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
