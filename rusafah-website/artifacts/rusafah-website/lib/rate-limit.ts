import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db/client";
import { env } from "@/lib/env";

/**
 * Fixed-window rate limiter backed by Postgres. Keys are salted SHA-256 hashes of
 * the client address, so no raw IP is ever persisted (PDPL, D-11).
 */
export async function clientKey(scope: string): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${env().RATE_LIMIT_SALT}:${scope}:${ip}`).digest("hex");
}

export async function consumeRateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; remaining: number }> {
  const windowMs = opts.windowSeconds * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  const rows = await db.execute<{ count: number }>(sql`
    insert into rate_limit_buckets (key, window_start, count)
    values (${opts.key}, ${windowStart.toISOString()}, 1)
    on conflict (key, window_start) do update set count = rate_limit_buckets.count + 1
    returning count
  `);
  const count = Number(rows.rows[0]?.count ?? 1);
  // Opportunistic cleanup of old windows, once in a while.
  if (count === 1 && Math.random() < 0.05) {
    await db.execute(
      sql`delete from rate_limit_buckets where window_start < now() - interval '1 day'`,
    );
  }
  return { allowed: count <= opts.limit, remaining: Math.max(0, opts.limit - count) };
}

export const RATE_LIMITED_MESSAGE =
  "تم استلام عدد كبير من الطلبات من جهازك خلال وقت قصير. يرجى المحاولة مرة أخرى بعد قليل.";
