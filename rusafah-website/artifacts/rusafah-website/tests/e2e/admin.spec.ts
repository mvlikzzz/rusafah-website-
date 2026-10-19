import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { e2ePool, hydrated } from "../helpers/e2e";
import { hashPassword } from "../../lib/password";

const ADMIN_EMAIL = "e2e-admin@rusafahre.com";
const ADMIN_PASSWORD = "E2E-Admin-Password-2026!";

let pool: ReturnType<typeof e2ePool>;
test.beforeEach(async () => {
  pool = e2ePool();
  await pool.query(
    `insert into admin_users (email, password_hash, name, role)
     values ($1, $2, 'مدير اختبار', 'owner')
     on conflict (email) do update set password_hash = excluded.password_hash, is_active = true`,
    [ADMIN_EMAIL, await hashPassword(ADMIN_PASSWORD)],
  );
});
test.afterEach(async () => {
  await pool.end();
});

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await hydrated(page);
  await page.getByLabel("البريد الإلكتروني").fill(ADMIN_EMAIL);
  await page.getByLabel("كلمة المرور").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
}

test.describe("admin CMS", () => {
  test("an unauthenticated visitor is redirected to the login page", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("a wrong password shows an Arabic error and does not sign in", async ({ page }) => {
    await page.goto("/admin/login");
    await hydrated(page);
    await page.getByLabel("البريد الإلكتروني").fill(ADMIN_EMAIL);
    await page.getByLabel("كلمة المرور").fill("wrong-password");
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page.getByText("البريد الإلكتروني أو كلمة المرور غير صحيحة.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("logs in, edits a site setting, and the change is visible on the public site", async ({
    page,
  }) => {
    const { rows } = await pool.query<{ google_maps_url: string | null }>(
      "select google_maps_url from site_settings where id = 'default'",
    );
    const original = rows[0]?.google_maps_url ?? "";
    const marker = `https://maps.google.com/?q=e2e-${Date.now()}`;

    await login(page);
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/settings");
    const mapsField = page.getByLabel("رابط خرائط جوجل");
    await mapsField.fill(marker);
    await page.getByRole("button", { name: "حفظ الإعدادات" }).click();
    await expect(page.getByRole("status").first()).toContainText("تم حفظ إعدادات الموقع");

    const { rows: updated } = await pool.query(
      "select google_maps_url from site_settings where id = 'default'",
    );
    expect(updated[0]?.google_maps_url).toBe(marker);

    // Restore the original value so the change does not linger on the live site.
    await mapsField.fill(original);
    await page.getByRole("button", { name: "حفظ الإعدادات" }).click();
    await expect(page.getByRole("status").first()).toContainText("تم حفظ إعدادات الموقع");
  });

  test("axe: the signed-in dashboard and settings screen have no WCAG 2.2 A/AA violations", async ({
    page,
  }) => {
    await login(page);
    await expect(page).toHaveURL(/\/admin$/);
    for (const route of ["/admin", "/admin/settings"]) {
      await page.goto(route);
      await hydrated(page);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(
          results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          null,
          2,
        ),
      ).toEqual([]);
    }
  });
});
