import { config as loadEnv } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { hashPassword } from "../lib/password";

loadEnv({ path: ".env.local" });
loadEnv();

/**
 * Creates (or resets the password of) a CMS admin user.
 * Usage: pnpm admin:create -- --email you@rusafahre.com --password '…' --name "الاسم" [--role owner]
 */
async function main() {
  const args = new Map<string, string>();
  const argv = process.argv.slice(2).filter((a) => a !== "--");
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const value = argv[i + 1];
    if (key && value) args.set(key, value);
  }
  const email = args.get("email")?.trim().toLowerCase();
  const password = args.get("password");
  const name = args.get("name") ?? email?.split("@")[0] ?? "مدير";
  const role = args.get("role") === "owner" ? "owner" : "editor";

  if (!email || !password) {
    console.error(
      'Usage: pnpm admin:create -- --email you@rusafahre.com --password "…" --name "الاسم" [--role owner]',
    );
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const db = drizzle(pool, { schema });
  try {
    const passwordHash = await hashPassword(password);
    const [existing] = await db
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1);
    if (existing) {
      await db
        .update(schema.adminUsers)
        .set({ passwordHash, name, role, isActive: true, updatedAt: new Date() })
        .where(eq(schema.adminUsers.id, existing.id));
      console.log(`Updated admin user ${email}.`);
    } else {
      await db.insert(schema.adminUsers).values({ email, passwordHash, name, role });
      console.log(`Created admin user ${email} (${role}).`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
