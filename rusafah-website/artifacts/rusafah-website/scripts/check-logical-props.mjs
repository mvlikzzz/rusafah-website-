// ENGINEERING.md §5: CSS logical properties everywhere. Fails on physical Tailwind
// direction utilities (ml-/mr-/pl-/pr-/left-/right-/text-left/text-right) in app code.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "components", "modules", "lib"];
const physical =
  /(?<![\w-])(?:ml|mr|pl|pr|left|right|text-left|text-right|border-l|border-r|rounded-l|rounded-r|scroll-ml|scroll-mr)-(?:\[|\d|px|auto|full|1\/|2\/|3\/)/g;
const offenders = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(entry)) {
      const src = readFileSync(p, "utf8");
      const lines = src.split("\n");
      lines.forEach((line, i) => {
        if (line.includes("logical-ok")) return;
        const m = line.match(physical);
        if (m) offenders.push(`${p}:${i + 1}: ${m.join(", ")}`);
      });
    }
  }
}
roots.forEach(walk);
if (offenders.length) {
  console.error(
    "Physical direction utilities found (use ms-/me-/ps-/pe-/start-/end-/text-start/text-end):\n" +
      offenders.join("\n"),
  );
  process.exit(1);
}
console.log("logical properties: ok");
