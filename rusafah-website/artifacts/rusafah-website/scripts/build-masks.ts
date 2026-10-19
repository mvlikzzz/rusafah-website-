/**
 * One-off: renders monochrome marks from the artboards (which sit on filled
 * backgrounds in the exported SVGs) into transparent PNG masks, so the site can
 * colour them with CSS `mask-image` + currentColor.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "./png";

const MARKS = ["seal", "subbrand", "icon-globe", "icon-hand", "icon-person", "icon-cert"];
const SRC_DIR = process.argv[2] ?? join(process.cwd(), "public", "vectors");
const SCALE = 4;

async function main() {
  const out = join(process.cwd(), "public", "images", "masks");
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    deviceScaleFactor: SCALE,
    viewport: { width: 1200, height: 1200 },
  });
  for (const name of MARKS) {
    const svg = readFileSync(join(SRC_DIR, `${name}.svg`), "utf8");
    const m = /viewBox="([\d.\- ]+)"/.exec(svg);
    const [, , w, h] = (m?.[1] ?? "0 0 100 100").split(" ").map(Number);
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:transparent"><div id="box" style="width:${w}px;height:${h}px">${svg.replace(/<svg([^>]*?)width="[^"]*"\s+height="[^"]*"/, '<svg$1width="100%" height="100%"')}</div></body></html>`,
    );
    const shot = await page.locator("#box").screenshot({ omitBackground: true, type: "png" });
    writeFileSync(join(out, `${name}.raw.png`), shot);
    const bounds = PNG.alphaBounds(shot);
    console.log(
      `${name}: rendered ${Math.round(w! * SCALE)}x${Math.round(h! * SCALE)} bounds=${JSON.stringify(bounds)}`,
    );
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
