import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSessionToken, hashPassword, verifyPassword } from "@/lib/auth";
import type { Role, SessionUser } from "@/lib/auth";

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
    return JSON.parse(await fs.readFile(USERS_FILE, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export async function ensureDefaultAdmin() {
  const users = await readUsers();
  if (users.length > 0) return;
  const now = new Date().toISOString();
  users.push({
    id: randomUUID(),
    username: process.env.ADMIN_SEED_USERNAME || "QualityCobaltDev",
    name: "Primary Admin",
    passwordHash: hashPassword(process.env.ADMIN_SEED_PASSWORD || "Banner1234!"),
    role: "admin",
    active: true,
    createdAt: now,
    updatedAt: now
  });
  await writeUsers(users);
}

export async function createUser(input: { username: string; name: string; password: string; role?: Role }) {
  const users = await readUsers();
  if (users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) throw new Error("Username already exists.");
  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomUUID(),
    username: input.username,
    name: input.name,
    passwordHash: hashPassword(input.password),
    role: input.role || "user",
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
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, "utf8").catch(() => "[]")) as Array<{ token: string; userId: string; expiresAt: string }>;
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
    return {
      ...u,
      ...patch,
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
