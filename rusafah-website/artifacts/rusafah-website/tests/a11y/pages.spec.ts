import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { hydrated } from "../helpers/e2e";

const ROUTES = [
  "/",
  "/projects",
  "/projects/latest",
  "/projects/rusafah-14",
  "/about",
  "/blog",
  "/blog/floors-for-sale-al-rayyan-rusafah-14",
  "/contact",
  "/privacy",
  "/search?q=الريان",
  "/admin/login",
];

for (const route of ROUTES) {
  test(`axe: ${route} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
    await page.goto(route);
    await hydrated(page);
    await page.waitForTimeout(1600); // let the first-paint splash finish fading
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // The map canvas is decorative here; its pins have an accessible list alongside.
      .exclude(".maplibregl-canvas")
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        null,
        2,
      ),
    ).toEqual([]);
  });
}

test("keyboard: the projects menu and the drawer are operable", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await page.getByRole("button", { name: /المشاريع، افتح القائمة/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "كل المشاريع" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "فتح القائمة", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
