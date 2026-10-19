import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const TEST_DIR = mkdtempSync(join(tmpdir(), "rusafah-media-test-"));
process.env.MEDIA_UPLOAD_DIR = join(TEST_DIR, "public", "uploads");
// lib/env.ts requires DATABASE_URL even though this module never queries it.
process.env.DATABASE_URL ??= "postgres://unit-test:unused@localhost:5432/unit_test";

const { processAndStoreImage, UPLOAD_ERROR_INVALID } = await import("@/modules/media/image-upload");

// A minimal valid 1x1 transparent PNG.
const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("processAndStoreImage", () => {
  it("re-encodes a real image and stores it under the configured upload dir", async () => {
    const file = new File([ONE_PIXEL_PNG], "pixel.png", { type: "image/png" });
    const result = await processAndStoreImage(file, "projects/test-project");
    expect("path" in result).toBe(true);
    if ("path" in result) {
      expect(result.path).toMatch(/^\/uploads\/projects\/test-project\/[\w-]+\.png$/);
      const onDisk = join(TEST_DIR, "public", result.path);
      expect(existsSync(onDisk)).toBe(true);
    }
  });

  it("rejects a file that is not a real image", async () => {
    const file = new File([Buffer.from("this is not an image")], "fake.jpg", {
      type: "image/jpeg",
    });
    const result = await processAndStoreImage(file, "projects/test-project");
    expect(result).toEqual({ error: UPLOAD_ERROR_INVALID });
  });
});
