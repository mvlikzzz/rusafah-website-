import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { testPool, truncateLeadTables } from "../helpers/db";

const sendNotification = vi.fn();
vi.mock("@/modules/notifications/mailer", () => ({
  sendNotification: (...args: unknown[]) => sendNotification(...args),
}));

const { deliverPendingNotifications } = await import("@/modules/notifications/worker");
const pool = testPool();

beforeAll(async () => {
  await truncateLeadTables(pool);
});
beforeEach(async () => {
  sendNotification.mockReset();
  await truncateLeadTables(pool);
});
afterAll(async () => {
  await pool.end();
});

async function enqueue(n: number) {
  for (let i = 0; i < n; i++) {
    await pool.query(
      "insert into notification_outbox (kind, payload) values ('lead.created', $1)",
      [
        JSON.stringify({
          kind: "lead.created",
          leadId: `l${i}`,
          leadKind: "contact",
          fullName: "x",
          phone: "+966500000000",
          sourcePath: "/",
        }),
      ],
    );
  }
}

describe("outbox delivery", () => {
  it("sends pending rows and marks them sent", async () => {
    await enqueue(3);
    sendNotification.mockResolvedValue(undefined);
    const r = await deliverPendingNotifications();
    expect(r).toEqual({ sent: 3, failed: 0 });
    expect(
      (
        await pool.query(
          "select count(*)::int as n from notification_outbox where sent_at is not null",
        )
      ).rows[0].n,
    ).toBe(3);
    // Nothing left to do on a second pass.
    expect(await deliverPendingNotifications()).toEqual({ sent: 0, failed: 0 });
  });

  it("records the error and backs off when delivery fails", async () => {
    await enqueue(1);
    sendNotification.mockRejectedValue(new Error("SMTP down"));
    const r = await deliverPendingNotifications();
    expect(r).toEqual({ sent: 0, failed: 1 });
    const row = (
      await pool.query(
        "select attempts, last_error, sent_at, next_attempt_at > now() as deferred from notification_outbox",
      )
    ).rows[0];
    expect(row).toEqual({ attempts: 1, last_error: "SMTP down", sent_at: null, deferred: true });
    // Deferred rows are not retried before their time.
    expect(await deliverPendingNotifications()).toEqual({ sent: 0, failed: 0 });
  });
});
