import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("verifies the correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("Correct-Horse-Battery-Staple-9");
    expect(hash).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
    await expect(verifyPassword("Correct-Horse-Battery-Staple-9", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });

  it("produces a different hash for the same password each time (random salt)", async () => {
    const a = await hashPassword("same-password-123456");
    const b = await hashPassword("same-password-123456");
    expect(a).not.toBe(b);
  });

  it("rejects malformed stored hashes instead of throwing", async () => {
    await expect(verifyPassword("anything", "not-a-valid-hash")).resolves.toBe(false);
  });
});
