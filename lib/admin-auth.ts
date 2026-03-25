import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE = "elevare_admin_session";

function buildToken(username: string) {
  const secret = process.env.ADMIN_SECRET || "elevare-default-secret-change-me";
  return createHash("sha256").update(`${username}:${secret}`).digest("hex");
}

export function getExpectedCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "change-this-password"
  };
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const { username } = getExpectedCredentials();
  return token === buildToken(username);
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const { username } = getExpectedCredentials();
  cookieStore.set(AUTH_COOKIE, buildToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
