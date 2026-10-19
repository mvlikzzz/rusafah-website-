// Copies the MapLibre worker bundle and the RTL text plugin into /public/map so the
// browser loads them from this origin. Runs before dev and build (package.json).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "map");
mkdirSync(out, { recursive: true });

const files = [
  ["node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "maplibre-gl-worker.mjs"],
  ["node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs", "maplibre-gl-shared.mjs"],
  ["node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js", "mapbox-gl-rtl-text.js"],
];
for (const [src, dest] of files) {
  const from = join(root, src);
  if (!existsSync(from)) throw new Error(`missing ${src} — run pnpm install`);
  copyFileSync(from, join(out, dest));
}
console.log(`map assets copied (${files.length})`);
