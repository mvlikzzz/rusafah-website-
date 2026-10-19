import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { adminSessionOptions, type AdminSessionData } from "@/lib/session";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(request, response, adminSessionOptions());
  if (!session.userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}
