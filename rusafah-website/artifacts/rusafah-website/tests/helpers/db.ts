import { Pool } from "pg";

/** Raw pool for assertions and cleanup in integration tests. */
export function testPool() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is not set");
  return new Pool({ connectionString: url, max: 2 });
}

export async function truncateLeadTables(pool: Pool) {
  await pool.query(
    "truncate leads, newsletter_subscribers, notification_outbox, rate_limit_buckets",
  );
}

export async function truncateAdminTables(pool: Pool) {
  await pool.query("truncate audit_log, admin_users cascade");
}
