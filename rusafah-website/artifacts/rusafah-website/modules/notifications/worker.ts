import "server-only";
import { PgBoss } from "pg-boss";
import { and, asc, isNull, lte, sql } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { env } from "@/lib/env";
import { dispatchNotification } from "./dispatch";
import type { OutboxPayload } from "./outbox";

const QUEUE = "deliver-notifications";
const MAX_ATTEMPTS = 12;

/** Exponential backoff: 1m, 2m, 4m … capped at 6h. */
function nextAttemptDelayMs(attempts: number) {
  return Math.min(6 * 3600_000, 60_000 * 2 ** Math.max(0, attempts - 1));
}

/**
 * Delivers pending outbox rows. Safe to run concurrently: each row is claimed
 * with `for update skip locked` so two workers never send the same email.
 */
export async function deliverPendingNotifications(
  limit = 20,
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < limit; i++) {
    const done = await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(schema.notificationOutbox)
        .where(
          and(
            isNull(schema.notificationOutbox.sentAt),
            lte(schema.notificationOutbox.nextAttemptAt, sql`now()`),
          ),
        )
        .orderBy(asc(schema.notificationOutbox.createdAt))
        .limit(1)
        .for("update", { skipLocked: true });
      if (!row) return true;
      try {
        await dispatchNotification(row.payload as OutboxPayload);
        await tx
          .update(schema.notificationOutbox)
          .set({ sentAt: new Date(), attempts: row.attempts + 1, lastError: null })
          .where(sql`${schema.notificationOutbox.id} = ${row.id}`);
        sent++;
      } catch (err) {
        const attempts = row.attempts + 1;
        const giveUp = attempts >= MAX_ATTEMPTS;
        await tx
          .update(schema.notificationOutbox)
          .set({
            attempts,
            lastError: err instanceof Error ? err.message : String(err),
            nextAttemptAt: giveUp
              ? new Date("2999-01-01T00:00:00Z")
              : new Date(Date.now() + nextAttemptDelayMs(attempts)),
          })
          .where(sql`${schema.notificationOutbox.id} = ${row.id}`);
        failed++;
      }
      return false;
    });
    if (done) break;
  }
  return { sent, failed };
}

let boss: PgBoss | undefined;

/** Starts pg-boss once per process: a minute schedule plus on-demand triggers. */
export async function startNotificationWorker(): Promise<PgBoss> {
  if (boss) return boss;
  boss = new PgBoss({ connectionString: env().DATABASE_URL, schema: "pgboss", max: 2 });
  boss.on("error", (err) => console.error("[pg-boss]", err));
  await boss.start();
  await boss.createQueue(QUEUE);
  await boss.work(QUEUE, { batchSize: 1 }, async () => {
    const result = await deliverPendingNotifications();
    if (result.sent || result.failed)
      console.log(`[notifications] sent=${result.sent} failed=${result.failed}`);
  });
  await boss.schedule(QUEUE, "* * * * *", undefined, { tz: "Asia/Riyadh" });
  return boss;
}

/** Asks the worker to run now (after a commit). Never throws into the request path. */
export async function triggerDelivery(): Promise<void> {
  try {
    if (!boss) {
      if (!env().RUN_NOTIFICATION_WORKER) return;
      await startNotificationWorker();
    }
    await boss!.send(QUEUE, {}, { singletonKey: "deliver", singletonSeconds: 5 });
  } catch (err) {
    console.error("[notifications] trigger failed", err);
  }
}
