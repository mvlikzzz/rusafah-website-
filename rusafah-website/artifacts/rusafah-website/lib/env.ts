import { createHmac } from "node:crypto";
import { z } from "zod";

/**
 * Server-side environment, validated once. Import only from server code.
 * Every variable is documented in .env.example.
 */
const schema = z
  .object({
    DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_SITE_URL: z.string().url().default(
      process.env.PUBLIC_HOSTNAMES?.split(",")[0]?.trim()
        ? `https://${process.env.PUBLIC_HOSTNAMES.split(",")[0].trim()}`
        : "http://localhost:3000",
    ),
    SMTP_URL: z.string().url().optional(),
    SMTP_FROM: z.string().min(3).default("no-reply@localhost"),
    LEADS_NOTIFY_EMAIL: z.string().email().optional(),
    RATE_LIMIT_SALT: z.string().min(8).optional(),
    RUN_NOTIFICATION_WORKER: z
      .enum(["true", "false"])
      .default("true")
      .transform((v) => v === "true"),
    /** Seals the admin session cookie (iron-session). 32+ random characters. */
    SESSION_SECRET: z
      .string()
      .min(32, "SESSION_SECRET must be at least 32 characters.")
      .default("development-only-session-secret-change-me-in-prod"),
    /** Local disk today; swap for an S3-compatible adapter once hosting is decided (D-11). */
    MEDIA_UPLOAD_DIR: z.string().min(1).default("public/uploads"),
    /** "none" (default) | "webhook" — a generic REST/PostgREST sink for a CRM (EW-10). */
    CRM_PROVIDER: z.enum(["none", "webhook"]).default("none"),
    CRM_WEBHOOK_URL: z.string().url().optional(),
    CRM_API_KEY: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  })
  .transform((v) => ({
    ...v,
    // Reuse the existing protected session key with domain separation when a
    // dedicated production salt is not supplied. Local development keeps a
    // stable non-secret default for repeatable tests.
    RATE_LIMIT_SALT:
      v.RATE_LIMIT_SALT ??
      (v.NODE_ENV === "production"
        ? createHmac("sha256", v.SESSION_SECRET)
            .update("rusafah/rate-limit/v1")
            .digest("hex")
        : "development-only-salt"),
  }))
  .refine((v) => v.CRM_PROVIDER !== "webhook" || Boolean(v.CRM_WEBHOOK_URL), {
    error: "CRM_WEBHOOK_URL is required when CRM_PROVIDER=webhook.",
    path: ["CRM_WEBHOOK_URL"],
  });

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}
