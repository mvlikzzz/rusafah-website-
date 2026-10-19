import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * E2E and accessibility suites run against a production build unless
 * PLAYWRIGHT_BASE_URL points at an already-running server. The product is
 * Arabic and RTL, so the browser locale is ar-SA and the timezone is Riyadh.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "a11y/**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  expect: { timeout: 10_000 },
  use: {
    actionTimeout: 15_000,
    baseURL: BASE_URL,
    trace: "on-first-retry",
    locale: "ar-SA",
    timezoneId: "Asia/Riyadh",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command: "pnpm build && pnpm start",
          url: BASE_URL,
          reuseExistingServer: false,
          timeout: 240_000,
          env: { NEXT_PUBLIC_ENABLE_DEV_ROUTES: "false" },
        },
      }),
});
