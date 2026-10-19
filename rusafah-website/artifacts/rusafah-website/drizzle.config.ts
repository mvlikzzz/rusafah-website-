import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://rusafah:rusafah@localhost:5434/rusafah_web",
  },
  strict: true,
  verbose: true,
});
