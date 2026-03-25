import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { promises as fs } from "node:fs";
import path from "node:path";

export type Role = "admin" | "user";
export type SessionUser = { id: string; name: string; email: string; role: Role };

type StoredSession = { token: string; userId: string; expiresAt: string };

const COOKIE_NAME = "elevare_session";
const SESSION_FILE = path.join(process.cwd(), "storage", "sessions.json");

function hashPassword(password: string, salt?: string) {
  const useSalt = salt || randomBytes(16).toString("hex");
  const derived = scryptSync(password, useSalt, 64).toString("hex");
  return `${useSalt}:${derived}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  const derived = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(key, "hex"), derived);
}

async function readSessions(): Promise<StoredSession[]> {
  try {
    const raw = await fs.readFile(SESSION_FILE, "utf8");
    return JSON.parse(raw) as StoredSession[];
  } catch {
    return [];
  }
}

async function writeSessions(sessions: StoredSession[]) {
  await fs.writeFile(SESSION_FILE, `${JSON.stringify(sessions, null, 2)}\n`, "utf8");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const sessions = await readSessions();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  sessions.push({ token, userId, expiresAt: expires });
  await writeSessions(sessions);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return;
  const sessions = await readSessions();
  await writeSessions(sessions.filter((s) => s.token !== token));
  store.delete(COOKIE_NAME);
}

export async function getSessionToken() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value || null;
}

export { hashPassword, verifyPassword };
