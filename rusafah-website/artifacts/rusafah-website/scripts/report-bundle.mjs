import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const directory = fileURLToPath(new URL("../.next/static/chunks/", import.meta.url));
const files = await readdir(directory).catch((error) => {
  if (error.code === "ENOENT") throw new Error("Run pnpm site:build before pnpm site:bundle.");
  throw error;
});
const chunks = await Promise.all(
  files.filter((name) => name.endsWith(".js")).map(async (name) => {
    const source = await readFile(join(directory, name));
    return { name, bytes: source.length, gzipBytes: gzipSync(source).length };
  }),
);
if (!chunks.length) throw new Error("No production JavaScript chunks found. Run pnpm site:build.");
chunks.sort((a, b) => b.bytes - a.bytes);
const kib = (value) => `${(value / 1024).toFixed(1)} KiB`;
console.table(chunks.slice(0, 10).map((chunk) => ({
  chunk: chunk.name,
  raw: kib(chunk.bytes),
  gzip: kib(chunk.gzipBytes),
})));
console.info(`All routes combined: ${kib(chunks.reduce((sum, c) => sum + c.bytes, 0))} raw JS.`);
console.info("This is build inventory, NOT initial-page transfer or a browser performance score.");
console.info("The map engine is intentionally deferred; check Network while scrolling to verify loading.");
