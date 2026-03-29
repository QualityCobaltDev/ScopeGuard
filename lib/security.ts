import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

const CSRF_COOKIE = "scopeguard_csrf";

export function passwordMeetsPolicy(password: string) {
  return password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export async function getOrSetCsrfToken() {
  const store = await cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = randomBytes(24).toString("hex");
  store.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return token;
}

export async function requireCsrf(request: Request) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-csrf-token") || "";

  if (!cookieToken || !headerToken) throw new Error("INVALID_CSRF");

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) {
    throw new Error("INVALID_CSRF");
  }
}

export async function requireSameOrigin(request: Request) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

  const origin = request.headers.get("origin");
  if (!origin) throw new Error("INVALID_ORIGIN");

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
  const expected = `${proto}://${host}`;
  if (origin !== expected) throw new Error("INVALID_ORIGIN");
}

export function sanitizeText(value: string, max = 5000) {
  return value.replace(/[<>]/g, "").trim().slice(0, max);
}
