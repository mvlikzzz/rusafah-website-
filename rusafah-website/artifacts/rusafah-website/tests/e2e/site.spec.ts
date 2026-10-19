import { expect, test } from "@playwright/test";
import { hydrated } from "../helpers/e2e";

test.describe("Arabic, right-to-left site", () => {
  test("home renders RTL with the brand tagline and featured projects", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("تجربــة");
    const tabs = page.getByRole("tablist", { name: "المشاريع المميزة" }).getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await tabs.first().click();
    await expect(page.getByRole("tabpanel")).toContainText("RUSAFAH");
  });

  test("projects page filters server-side through the URL", async ({ page }) => {
    await page.goto("/projects?types=villas");
    await expect(page).toHaveURL(/types=villas/);
    const cards = page.getByRole("main").locator("article");
    await expect(cards.first()).toBeVisible();
    for (const text of await cards.allInnerTexts()) expect(text).toContain("فلل");
    await page.goto("/projects?priceMin=1500000&priceMax=1800000");
    await expect(page.getByRole("main").locator("article")).toHaveCount(1);
    await expect(page.getByRole("main")).toContainText("RUSAFAH 14");
  });

  test("project page shows price, features, warranties and units", async ({ page }) => {
    await page.goto("/projects/rusafah-14");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("14");
    await expect(page.getByText("2,073,139")).toBeVisible();
    await expect(page.getByRole("heading", { name: "المميزات" })).toBeVisible();
    await expect(page.getByText("منزل ذكي")).toBeVisible();
    await expect(page.getByLabel("اختر الوحدة")).toHaveValue("0");
    await expect(page.getByText("252.27")).toBeVisible();
  });

  test("blog lists published articles and opens one", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("المقالآت");
    await page
      .getByRole("link", { name: /رصافة ١٤ بتصميم عصري/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/blog\/floors-for-sale-al-rayyan-rusafah-14/);
    await expect(page.getByRole("heading", { level: 2, name: /ما الضمانات/ })).toBeVisible();
  });

  test("search returns projects and articles", async ({ page }) => {
    await page.goto("/search?q=الريان");
    const results = page.getByRole("list", { name: "نتائج البحث" }).getByRole("listitem");
    await expect(results.first()).toBeVisible();
    expect(await results.count()).toBeGreaterThan(1);
  });

  test("legal pages come from the database and are linked from the footer", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await page.getByRole("contentinfo").getByRole("link", { name: "سياسة الخصوصية" }).click();
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("سياسة الخصوصية");
    await expect(page.getByRole("heading", { name: /ملفات تعريف الارتباط/ })).toBeVisible();
  });

  test("unknown routes show the Arabic not-found page", async ({ page }) => {
    const res = await page.goto("/projects/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("الصفحة غير موجودة");
  });
});
