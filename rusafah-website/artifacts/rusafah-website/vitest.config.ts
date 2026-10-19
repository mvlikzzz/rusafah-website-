import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

/**
 * Two projects: `unit` is pure and fast; `integration` talks to the database in
 * TEST_DATABASE_URL (created by `pnpm db:test:prepare`). `server-only` is aliased
 * to an empty module because Vitest is not a React Server Components runtime.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": root,
      "server-only": `${root}tests/helpers/empty.ts`,
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          setupFiles: ["tests/helpers/integration-setup.ts"],
          fileParallelism: false,
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
