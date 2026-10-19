import { config as loadEnv } from "dotenv";
import { vi } from "vitest";

loadEnv({ path: ".env.local" });
loadEnv();

// Integration tests run against the dedicated test database, never the dev one.
const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl) throw new Error("TEST_DATABASE_URL must be set for integration tests");
process.env.DATABASE_URL = testUrl;
process.env.RUN_NOTIFICATION_WORKER = "false";
process.env.RATE_LIMIT_SALT = "integration-test-salt";

// Server actions read request headers for rate limiting; outside a request we
// provide a controllable stand-in.
export const fakeHeaders = new Map<string, string>([["x-forwarded-for", "203.0.113.10"]]);

/**
 * Minimal stand-in for `await cookies()` implementing iron-session's CookieStore
 * shape (get/set). A single module-level instance, so a test can sign a session
 * in with getAdminSession() and have a later admin action see the same cookie.
 */
class FakeCookieStore {
  private store = new Map<string, string>();
  get(name: string) {
    const value = this.store.get(name);
    return value === undefined ? undefined : { name, value };
  }
  set(name: string, value: string) {
    this.store.set(name, value);
  }
  delete(name: string) {
    this.store.delete(name);
  }
  clear() {
    this.store.clear();
  }
}
export const fakeCookieStore = new FakeCookieStore();

vi.mock("next/headers", () => ({
  headers: async () => ({ get: (k: string) => fakeHeaders.get(k.toLowerCase()) ?? null }),
  cookies: async () => fakeCookieStore,
}));

// revalidatePath needs a real request/static-generation context that does not
// exist outside Next.js; admin actions call it after a write, so it is a no-op here.
vi.mock("next/cache", () => ({
  revalidatePath: () => undefined,
  revalidateTag: () => undefined,
}));
