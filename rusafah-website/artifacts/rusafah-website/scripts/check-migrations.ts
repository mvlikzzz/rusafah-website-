/**
 * E-09 gate: every migration has a hand-written .down.sql, and up → down → up
 * runs cleanly on the test database. Usage: pnpm check:migrations
 */
import { config as loadEnv } from "dotenv";
import { existsSync, readdirSync } from "node:fs";
import { Pool } from "pg";
import { runMigrations } from "../db/migrate";
import { rollbackLast } from "../db/rollback";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is not set");
  const ups = readdirSync("db/migrations").filter(
    (f) => f.endsWith(".sql") && !f.endsWith(".down.sql"),
  );
  for (const up of ups) {
    const down = up.replace(/\.sql$/, ".down.sql");
    if (!existsSync(`db/migrations/${down}`)) throw new Error(`migration ${up} has no ${down}`);
  }
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    await pool.query(
      "drop schema if exists public cascade; create schema public; drop schema if exists drizzle cascade;",
    );
  } finally {
    await pool.end();
  }
  await runMigrations(url);
  for (let i = 0; i < ups.length; i++) {
    const tag = await rollbackLast(url);
    if (!tag) throw new Error("rollback returned nothing while migrations remained");
  }
  const check = new Pool({ connectionString: url, max: 1 });
  try {
    const { rows } = await check.query(
      "select count(*)::int as n from information_schema.tables where table_schema = 'public'",
    );
    if (rows[0].n !== 0) throw new Error(`down migrations left ${rows[0].n} table(s) behind`);
  } finally {
    await check.end();
  }
  await runMigrations(url);
  console.log(`migrations reversible: ${ups.length} up/down pair(s) verified`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
