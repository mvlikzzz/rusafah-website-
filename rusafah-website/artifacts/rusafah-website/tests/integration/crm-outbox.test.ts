import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { testPool, truncateLeadTables } from "../helpers/db";
import { fakeHeaders } from "../helpers/integration-setup";

// Set before any module that calls env() runs, so the CRM adapter picks it up.
process.env.CRM_PROVIDER = "webhook";
process.env.CRM_WEBHOOK_URL = "https://crm.example.com/rest/v1/leads";
process.env.CRM_API_KEY = "test-api-key";

const { submitContact } = await import("@/modules/leads/actions");
const { initialFormState } = await import("@/modules/leads/form-state");
const { seed } = await import("@/db/seed/index");

const pool = testPool();

function form(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.set(k, v);
  return fd;
}

beforeAll(async () => {
  await seed(process.env.TEST_DATABASE_URL);
});
beforeEach(async () => {
  await truncateLeadTables(pool);
  fakeHeaders.set("x-forwarded-for", `203.0.113.${Math.floor(Math.random() * 200) + 1}`);
});
afterAll(async () => {
  await pool.end();
});

describe("CRM outbox (CRM_PROVIDER=webhook)", () => {
  it("enqueues a crm.lead_sync row alongside the email alert, in the same transaction", async () => {
    const state = await submitContact(
      initialFormState,
      form({
        fullName: "سارة القحطاني",
        phone: "0559876543",
        message: "أرغب بزيارة مشروع رصافة 14 هذا الأسبوع.",
        sourcePath: "/contact",
      }),
    );
    expect(state.status).toBe("success");

    const { rows } = await pool.query(
      "select kind, payload from notification_outbox order by kind",
    );
    const kinds = rows.map((r) => r.kind);
    expect(kinds).toEqual(["crm.lead_sync", "lead.created"]);

    const crmRow = rows.find((r) => r.kind === "crm.lead_sync")!;
    expect(crmRow.payload).toMatchObject({
      leadKind: "contact",
      fullName: "سارة القحطاني",
      phone: "+966559876543",
    });
  });
});
