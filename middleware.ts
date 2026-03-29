import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER_COOKIE = "elevare_session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/signin" && !token) {
    const url = new URL("/admin/signin", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard") && !token) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';");

  if (pathname.startsWith("/admin") || pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/dashboard")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"]
};
