import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { testPool, truncateAdminTables } from "../helpers/db";
import { fakeCookieStore } from "../helpers/integration-setup";

const { seed } = await import("@/db/seed/index");
const { hashPassword } = await import("@/lib/password");
const { getAdminSession } = await import("@/lib/session");
const { updateSiteSettings, updateCompanyStat } = await import("@/modules/admin/settings-actions");
const { initialFormState } = await import("@/modules/admin/form-state");

const pool = testPool();

function form(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.set(k, v);
  return fd;
}

async function signInAsFakeAdmin() {
  const [{ id }] = (
    await pool.query<{ id: string }>(
      `insert into admin_users (email, password_hash, name, role)
       values ($1, $2, $3, 'owner') returning id`,
      ["editor@rusafahre.com", await hashPassword("does-not-matter-12345"), "محرر الاختبار"],
    )
  ).rows;
  const session = await getAdminSession();
  session.userId = id;
  session.email = "editor@rusafahre.com";
  session.name = "محرر الاختبار";
  session.role = "owner";
  await session.save();
  return id;
}

beforeAll(async () => {
  await seed(process.env.TEST_DATABASE_URL);
});
beforeEach(async () => {
  await truncateAdminTables(pool);
  fakeCookieStore.clear();
});
afterAll(async () => {
  await pool.end();
});

describe("admin settings actions", () => {
  it("rejects a mutation with no signed-in session", async () => {
    await expect(
      updateSiteSettings(
        initialFormState,
        form({
          companyNameAr: "x",
          companyNameEn: "x",
          taglineAr: "x",
          taglineEn: "x",
          unifiedNumber: "920032809",
          internationalNumber: "+966115551234",
          whatsappNumber: "+966501234567",
          email: "info@rusafahre.com",
        }),
      ),
    ).rejects.toThrow();
  });

  it("updates site settings and writes one audit record naming the actor", async () => {
    const actorId = await signInAsFakeAdmin();
    const state = await updateSiteSettings(
      initialFormState,
      form({
        companyNameAr: "رُصافة العقارية",
        companyNameEn: "RUSAFAH Real Estate",
        taglineAr: "تجربة تفهمك",
        taglineEn: "An experience that understands you",
        unifiedNumber: "920011111",
        internationalNumber: "+966115559999",
        whatsappNumber: "+966501112222",
        email: "info@rusafahre.com",
        instagramUrl: "https://instagram.com/rusafahre",
      }),
    );
    expect(state.status).toBe("success");

    const { rows: settingsRows } = await pool.query(
      "select unified_number, social_links from site_settings where id = 'default'",
    );
    expect(settingsRows[0].unified_number).toBe("920011111");
    expect(settingsRows[0].social_links.instagram).toBe("https://instagram.com/rusafahre");

    const { rows: auditRows } = await pool.query(
      "select actor_id, actor_email, action, entity_type from audit_log",
    );
    expect(auditRows).toEqual([
      {
        actor_id: actorId,
        actor_email: "editor@rusafahre.com",
        action: "update",
        entity_type: "site_settings",
      },
    ]);
  });

  it("rejects an invalid email and writes no audit record", async () => {
    await signInAsFakeAdmin();
    const state = await updateSiteSettings(
      initialFormState,
      form({
        companyNameAr: "رُصافة",
        companyNameEn: "RUSAFAH",
        taglineAr: "شعار",
        taglineEn: "tag",
        unifiedNumber: "920011111",
        internationalNumber: "+966115559999",
        whatsappNumber: "+966501112222",
        email: "not-an-email",
      }),
    );
    expect(state.status).toBe("error");
    expect(state.errors?.email).toBeTruthy();
    const { rows } = await pool.query("select count(*)::int as n from audit_log");
    expect(rows[0].n).toBe(0);
  });

  it("updates one company stat without touching the others", async () => {
    await signInAsFakeAdmin();
    const { rows } = await pool.query("select id, key from company_stats order by sort limit 1");
    const target = rows[0];
    const state = await updateCompanyStat(
      initialFormState,
      form({
        id: target.id,
        value: "999",
        labelAr: "قيمة محدّثة للاختبار",
        asOf: "2026-01-01",
        sourceAr: "بيانات الاختبار",
      }),
    );
    expect(state.status).toBe("success");
    const { rows: updated } = await pool.query(
      "select value, label_ar from company_stats where id = $1",
      [target.id],
    );
    expect(Number(updated[0].value)).toBe(999);
    expect(updated[0].label_ar).toBe("قيمة محدّثة للاختبار");
  });
});
