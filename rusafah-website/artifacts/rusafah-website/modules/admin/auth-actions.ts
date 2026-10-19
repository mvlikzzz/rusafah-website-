"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db/client";
import { getAdminSession, type AdminRole } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { clientKey, consumeRateLimit, RATE_LIMITED_MESSAGE } from "@/lib/rate-limit";
import { flattenIssues, loginSchema } from "./validation";
import type { FormState } from "./form-state";

const GENERIC_LOGIN_ERROR = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
const ROLES: readonly AdminRole[] = ["owner", "editor"];

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  const { allowed } = await consumeRateLimit({
    key: await clientKey("admin-login"),
    limit: 10,
    windowSeconds: 600,
  });
  if (!allowed) return { status: "error", message: RATE_LIMITED_MESSAGE };

  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, parsed.data.email))
    .limit(1);

  const valid =
    user && user.isActive && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!valid || !user) return { status: "error", message: GENERIC_LOGIN_ERROR };

  const session = await getAdminSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = ROLES.includes(user.role as AdminRole) ? (user.role as AdminRole) : "editor";
  await session.save();

  await db
    .update(schema.adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(schema.adminUsers.id, user.id));

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}
