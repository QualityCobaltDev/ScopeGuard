import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "elevare_session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  const { pathname } = req.nextUrl;

  if ((pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) && !token) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"]
};
