import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

/**
 * One pool per process. Next.js dev reloads modules, so the pool is cached on
 * globalThis to avoid exhausting Postgres connections during development.
 */
const globalForDb = globalThis as unknown as { __rusafahPool?: Pool };

export const pool: Pool =
  globalForDb.__rusafahPool ??
  new Pool({
    connectionString: env().DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__rusafahPool = pool;

export const db = drizzle(pool, { schema, casing: "snake_case" });
export type Db = typeof db;
export { schema };
