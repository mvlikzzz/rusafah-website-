import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { testPool, truncateLeadTables } from "../helpers/db";
import { fakeHeaders } from "../helpers/integration-setup";

vi.mock("@/modules/notifications/worker", () => ({ triggerDelivery: async () => undefined }));

const { submitContact, registerInterest, bookVisit, subscribeNewsletter } =
  await import("@/modules/leads/actions");
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

describe("contact form", () => {
  it("stores the lead and its notification in one transaction", async () => {
    const state = await submitContact(
      initialFormState,
      form({
        fullName: "محمد العتيبي",
        email: "m@example.com",
        phone: "0501234567",
        message: "أرغب في معرفة تفاصيل مشروع رصافة 14.",
        sourcePath: "/contact",
      }),
    );
    expect(state.status).toBe("success");
    const leads = await pool.query("select kind, phone, email, status from leads");
    expect(leads.rows).toEqual([
      { kind: "contact", phone: "+966501234567", email: "m@example.com", status: "new" },
    ]);
    const outbox = await pool.query(
      "select kind, payload->>'leadKind' as lead_kind, sent_at from notification_outbox",
    );
    expect(outbox.rows).toEqual([{ kind: "lead.created", lead_kind: "contact", sent_at: null }]);
  });

  it("rejects invalid input with Arabic field errors and writes nothing", async () => {
    const state = await submitContact(
      initialFormState,
      form({ fullName: "x", phone: "12", message: "قصير" }),
    );
    expect(state.status).toBe("error");
    expect(state.errors?.phone).toMatch(/رقم جوال سعودي/);
    expect((await pool.query("select count(*)::int as n from leads")).rows[0].n).toBe(0);
    expect((await pool.query("select count(*)::int as n from notification_outbox")).rows[0].n).toBe(
      0,
    );
  });

  it("rate-limits a burst from one address", async () => {
    let limited = 0;
    for (let i = 0; i < 8; i++) {
      const s = await submitContact(
        initialFormState,
        form({
          fullName: "محمد العتيبي",
          phone: "0501234567",
          message: "رسالة اختبار طويلة بما يكفي.",
        }),
      );
      if (s.status === "error" && s.message?.includes("عدد كبير")) limited++;
    }
    expect(limited).toBeGreaterThan(0);
    expect((await pool.query("select count(*)::int as n from leads")).rows[0].n).toBe(6);
  });
});

describe("project forms", () => {
  it("registers interest against a real project and names it in the alert", async () => {
    const { rows } = await pool.query("select id from projects where code = '14'");
    const projectId = rows[0].id as string;
    const state = await registerInterest(
      initialFormState,
      form({
        fullName: "سارة الشمري",
        phone: "0559876543",
        email: "",
        projectId,
        sourcePath: "/projects/rusafah-14",
      }),
    );
    expect(state.status).toBe("success");
    const outbox = await pool.query("select payload from notification_outbox");
    expect(outbox.rows[0].payload.projectName).toContain("RUSAFAH 14");
    expect(outbox.rows[0].payload.email).toBeUndefined();
  });

  it("books a visit with a future date and stores the appointment", async () => {
    const { rows } = await pool.query("select id from projects where code = '14'");
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    const state = await bookVisit(
      initialFormState,
      form({
        fullName: "سارة الشمري",
        phone: "0559876543",
        projectId: rows[0].id,
        appointmentType: "site_visit",
        preferredDate: tomorrow,
        preferredTime: "10:30",
      }),
    );
    expect(state.status).toBe("success");
    const lead = (
      await pool.query(
        "select kind, appointment_type, preferred_time, preferred_date::text as d from leads",
      )
    ).rows[0];
    expect(lead).toEqual({
      kind: "visit",
      appointment_type: "site_visit",
      preferred_time: "10:30",
      d: tomorrow,
    });
  });

  it("refuses an unknown project id", async () => {
    const state = await registerInterest(
      initialFormState,
      form({
        fullName: "سارة الشمري",
        phone: "0559876543",
        projectId: "6f0f7a9e-5f1c-4f1e-9c0a-6a1a2b3c4d5e",
      }),
    );
    expect(state.status).toBe("error");
    expect((await pool.query("select count(*)::int as n from leads")).rows[0].n).toBe(0);
  });
});

describe("newsletter", () => {
  it("is idempotent per email and only alerts once", async () => {
    const a = await subscribeNewsletter(
      initialFormState,
      form({ email: "Reader@Example.com", sourcePath: "/" }),
    );
    fakeHeaders.set("x-forwarded-for", "203.0.113.250");
    const b = await subscribeNewsletter(
      initialFormState,
      form({ email: "reader@example.com", sourcePath: "/blog" }),
    );
    expect(a.status).toBe("success");
    expect(b.status).toBe("success");
    expect(
      (await pool.query("select count(*)::int as n from newsletter_subscribers")).rows[0].n,
    ).toBe(1);
    expect((await pool.query("select count(*)::int as n from notification_outbox")).rows[0].n).toBe(
      1,
    );
  });
});
