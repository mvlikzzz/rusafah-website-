import { config as loadEnv } from "dotenv";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv();

/**
 * Reverts the most recently applied migration using its hand-written
 * NNNN_name.down.sql (E-09). drizzle-kit does not generate down migrations, so
 * every migration in db/migrations must ship one; scripts/check-migrations.ts
 * enforces the pairing in CI.
 */
export async function rollbackLast(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  try {
    const { rows } = await pool.query<{ id: number; hash: string; created_at: string }>(
      `select id, hash, created_at from drizzle.__drizzle_migrations order by created_at desc limit 1`,
    );
    const last = rows[0];
    if (!last) {
      console.log("nothing to roll back");
      return null;
    }
    const journal = JSON.parse(readFileSync("db/migrations/meta/_journal.json", "utf8")) as {
      entries: { tag: string; when: number }[];
    };
    const entry = journal.entries.find((e) => String(e.when) === String(last.created_at));
    if (!entry) throw new Error(`no journal entry for applied migration ${last.created_at}`);
    const downFile = join("db/migrations", `${entry.tag}.down.sql`);
    if (!existsSync(downFile)) throw new Error(`missing down migration ${downFile}`);
    const sql = readFileSync(downFile, "utf8");
    await pool.query("begin");
    try {
      await pool.query(sql);
      await pool.query(`delete from drizzle.__drizzle_migrations where id = $1`, [last.id]);
      await pool.query("commit");
    } catch (err) {
      await pool.query("rollback");
      throw err;
    }
    console.log(`rolled back ${entry.tag}`);
    return entry.tag;
  } finally {
    await pool.end();
  }
}

export function listMigrationTags() {
  return readdirSync("db/migrations")
    .filter((f) => f.endsWith(".sql") && !f.endsWith(".down.sql"))
    .map((f) => f.replace(/\.sql$/, ""));
}

if (process.argv[1]?.endsWith("rollback.ts")) {
  rollbackLast().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
