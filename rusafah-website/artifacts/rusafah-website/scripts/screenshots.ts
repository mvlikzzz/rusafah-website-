/**
 * Full-page screenshots of every public route at desktop and mobile widths,
 * for design review. Usage: pnpm tsx scripts/screenshots.ts [outDir] [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2] ?? "screenshots";
const base = process.argv[3] ?? "http://localhost:3000";
const only = process.argv.slice(4);
const allRoutes: [string, string][] = [
  ["home", "/"],
  ["projects", "/projects"],
  ["projects-latest", "/projects/latest"],
  ["project-14", "/projects/rusafah-14"],
  ["project-09", "/projects/rusafah-09"],
  ["about", "/about"],
  ["blog", "/blog"],
  ["article", "/blog/floors-for-sale-al-rayyan-rusafah-14"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
  ["search", "/search?q=الريان"],
  ["vectors", "/dev/vectors"],
];
const routes = only.length ? allRoutes.filter(([n]) => only.includes(n)) : allRoutes;

async function main() {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [width, height, tag] of [
    [1440, 900, "desktop"],
    [390, 844, "mobile"],
  ] as const) {
    const context = await browser.newContext({
      viewport: { width, height },
      locale: "ar-SA",
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    for (const [name, path] of routes) {
      await page.goto(`${base}${path}`, { waitUntil: "load", timeout: 60_000 });
      await page.waitForTimeout(2500);
      // trigger lazy images by scrolling through
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(out, `${tag}-${name}.png`), fullPage: true });
      console.log(`${tag}-${name}.png`);
    }
    await context.close();
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
