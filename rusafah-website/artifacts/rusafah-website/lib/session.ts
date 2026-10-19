import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { env } from "@/lib/env";

export type AdminRole = "owner" | "editor";

export type AdminSessionData = {
  userId?: string;
  email?: string;
  name?: string;
  role?: AdminRole;
};

export const ADMIN_SESSION_COOKIE = "rusafah_admin_session";

/** Shared by server actions/pages (via next/headers) and middleware (via req/res). */
export function adminSessionOptions(): SessionOptions {
  return {
    password: env().SESSION_SECRET,
    cookieName: ADMIN_SESSION_COOKIE,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
    },
  };
}

export async function getAdminSession() {
  return getIronSession<AdminSessionData>(await cookies(), adminSessionOptions());
}
