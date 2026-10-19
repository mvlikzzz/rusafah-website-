import { config as loadEnv } from "dotenv";
import { Pool } from "pg";
import { runMigrations } from "./migrate";

loadEnv({ path: ".env.local" });
loadEnv();

/** Creates (if needed) and migrates the integration-test database named by TEST_DATABASE_URL. */
async function main() {
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) throw new Error("TEST_DATABASE_URL is not set");
  const target = new URL(testUrl);
  const dbName = target.pathname.replace(/^\//, "");
  const admin = new URL(testUrl);
  admin.pathname = "/postgres";
  const pool = new Pool({ connectionString: admin.toString(), max: 1 });
  try {
    const exists = await pool.query("select 1 from pg_database where datname = $1", [dbName]);
    if (exists.rowCount === 0) await pool.query(`create database "${dbName}"`);
  } finally {
    await pool.end();
  }
  const reset = new Pool({ connectionString: testUrl, max: 1 });
  try {
    await reset.query("drop schema if exists public cascade; create schema public;");
    await reset.query(
      "drop schema if exists drizzle cascade; drop schema if exists pgboss cascade;",
    );
  } finally {
    await reset.end();
  }
  await runMigrations(testUrl);
  console.log(`test database ${dbName} ready`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
