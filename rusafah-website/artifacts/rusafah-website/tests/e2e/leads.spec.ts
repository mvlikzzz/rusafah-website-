import { expect, test } from "@playwright/test";
import { e2ePool, findMailpitMessage, hydrated } from "../helpers/e2e";

// One pool per test: fullyParallel runs each test as its own group, so a shared
// pool closed in afterAll would be reused by the next test on the same worker.
let pool: ReturnType<typeof e2ePool>;
test.beforeEach(() => {
  pool = e2ePool();
});
test.afterEach(async () => {
  await pool.end();
});

test.describe("lead capture", () => {
  test("contact form validates in Arabic, then stores the lead and emails the team", async ({
    page,
  }) => {
    const marker = `اختبار ${Date.now()}`;
    await page.goto("/contact");
    await hydrated(page);
    await page.getByRole("button", { name: "ارسال" }).click();
    await expect(page.locator("form [role=alert]").first()).toContainText(/يرجى/);
    await page.getByLabel("الإسم الكامل").fill(`محمد العتيبي ${marker}`);
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("e2e@example.com");
    await page.getByLabel("رقم الهاتف").fill("0501234567");
    await page
      .getByLabel("استفسارك أو طلباتك")
      .fill(`أرغب في معرفة تفاصيل مشروع رصافة 14. ${marker}`);
    await page.getByRole("button", { name: "ارسال" }).click();
    await expect(page.getByRole("main").getByRole("status")).toContainText("وصلنا استفسارك");
    const { rows } = await pool.query(
      "select phone, email, status from leads where full_name like $1",
      [`%${marker}%`],
    );
    expect(rows).toEqual([{ phone: "+966501234567", email: "e2e@example.com", status: "new" }]);
    const mail = await findMailpitMessage(marker);
    expect(mail?.Subject).toContain("استفسار من صفحة تواصل معنا");
  });

  test("interest dialog on a project stores a lead tied to that project", async ({ page }) => {
    const marker = `اهتمام ${Date.now()}`;
    await page.goto("/projects/rusafah-14");
    await hydrated(page);
    await page.getByRole("button", { name: "سجــل اهتمامك" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("الإسم الكامل").fill(`سارة الشمري ${marker}`);
    await dialog.getByLabel("رقم الهاتف").fill("0559876543");
    await dialog.getByRole("button", { name: "ارسال" }).click();
    await expect(dialog.getByRole("status")).toContainText("تم تسجيل اهتمامك");
    const { rows } = await pool.query(
      "select l.kind, p.code from leads l join projects p on p.id = l.project_id where l.full_name like $1",
      [`%${marker}%`],
    );
    expect(rows).toEqual([{ kind: "interest", code: "14" }]);
  });

  test("newsletter subscription from the footer", async ({ page }) => {
    const email = `news-${Date.now()}@example.com`;
    await page.goto("/about");
    await hydrated(page);
    await page.getByLabel("البريد الإلكتروني للاشتراك في النشرة").fill(email);
    await page.getByRole("button", { name: "اشترك" }).click();
    await expect(page.locator("#newsletter-status")).toContainText("تم اشتراكك");
    const { rows } = await pool.query("select email from newsletter_subscribers where email = $1", [
      email,
    ]);
    expect(rows.length).toBe(1);
  });
});
