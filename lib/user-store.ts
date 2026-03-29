import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSessionToken, hashPassword, verifyPassword } from "@/lib/auth/server";
import type { Role, SessionUser } from "@/lib/auth";
import { passwordMeetsPolicy, sanitizeText } from "@/lib/security";

export type StoredUser = {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const USERS_FILE = path.join(process.cwd(), "storage", "users.json");
const SESSIONS_FILE = path.join(process.cwd(), "storage", "sessions.json");

async function readUsers(): Promise<StoredUser[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(USERS_FILE, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

function normalizeRole(role?: Role): Role {
  if (!role) return "viewer";
  return role;
}

export async function ensureDefaultAdmin() {
  const users = await readUsers();
  if (users.length > 0) return;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD || "Banner1234!";
  if (!passwordMeetsPolicy(seedPassword)) throw new Error("ADMIN_SEED_PASSWORD does not meet password policy.");

  const now = new Date().toISOString();
  users.push({
    id: randomUUID(),
    username: process.env.ADMIN_SEED_USERNAME || "QualityCobaltDev",
    name: "Primary Admin",
    passwordHash: hashPassword(seedPassword),
    role: "owner",
    active: true,
    createdAt: now,
    updatedAt: now
  });
  await writeUsers(users);
}

export async function createUser(input: { username: string; name: string; password: string; role?: Role }) {
  const users = await readUsers();
  const username = sanitizeText(input.username, 60);
  const name = sanitizeText(input.name, 120);
  if (!passwordMeetsPolicy(input.password)) throw new Error("Password must be at least 10 chars and include upper, lower, and number.");
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) throw new Error("Username already exists.");

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomUUID(),
    username,
    name,
    passwordHash: hashPassword(input.password),
    role: normalizeRole(input.role),
    active: true,
    createdAt: now,
    updatedAt: now
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function authenticateUser(username: string, password: string) {
  const users = await readUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.active);
  if (!user) return null;

  const isLegacyPlaintext = !user.passwordHash.includes(":");
  if (isLegacyPlaintext) {
    if (user.passwordHash !== password) return null;
    user.passwordHash = hashPassword(password);
    user.updatedAt = new Date().toISOString();
    await writeUsers(users);
    return user;
  }

  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) return null;
  let sessions: Array<{ token: string; userId: string; expiresAt: string }> = [];
  try {
    const parsed = JSON.parse(await fs.readFile(SESSIONS_FILE, "utf8").catch(() => "[]")) as unknown;
    if (Array.isArray(parsed)) sessions = parsed as Array<{ token: string; userId: string; expiresAt: string }>;
  } catch (error) {
    console.error("[auth] Failed to parse sessions storage. Resetting to empty session list.", error);
  }
  const found = sessions.find((s) => s.token === token && new Date(s.expiresAt) > new Date());
  if (!found) return null;
  const users = await readUsers();
  const user = users.find((u) => u.id === found.userId && u.active);
  if (!user) return null;
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}

export async function listUsers() {
  return readUsers();
}

export async function updateUser(id: string, patch: Partial<Omit<StoredUser, "id" | "createdAt" | "passwordHash">> & { password?: string }) {
  const users = await readUsers();
  const next = users.map((u) => {
    if (u.id !== id) return u;
    if (patch.password && !passwordMeetsPolicy(patch.password)) throw new Error("Password does not meet policy.");
    return {
      ...u,
      ...patch,
      username: patch.username ? sanitizeText(patch.username, 60) : u.username,
      name: patch.name ? sanitizeText(patch.name, 120) : u.name,
      passwordHash: patch.password ? hashPassword(patch.password) : u.passwordHash,
      updatedAt: new Date().toISOString()
    };
  });
  await writeUsers(next);
  return next.find((u) => u.id === id) || null;
}

export async function deleteUser(id: string) {
  const users = await readUsers();
  await writeUsers(users.filter((u) => u.id !== id));
}
