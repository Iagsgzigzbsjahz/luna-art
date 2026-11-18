import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// يعمل على مسارات /admin فقط، فلا يبطئ صفحات الزوار.
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";

  let redirectTo: string | null = null;
  if (!user && !isLogin) redirectTo = "/admin/login";
  if (user && isLogin) redirectTo = "/admin";

  if (redirectTo) {
    const redirect = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    redirect.headers.set("Cache-Control", "no-store");
    return redirect;
  }

  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
