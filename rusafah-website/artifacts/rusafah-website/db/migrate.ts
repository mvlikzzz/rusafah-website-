import { config as loadEnv } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

loadEnv({ path: ".env.local" });
loadEnv();

/** Applies every pending migration in db/migrations. Idempotent. */
export async function runMigrations(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder: "./db/migrations" });
  } finally {
    await pool.end();
  }
}

if (process.argv[1]?.endsWith("migrate.ts")) {
  runMigrations()
    .then(() => {
      console.log("migrations applied");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
