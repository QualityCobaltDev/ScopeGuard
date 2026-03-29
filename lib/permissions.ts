import type { Role } from "@/lib/auth";
import { getCurrentUser } from "@/lib/user-store";

const roleRank: Record<Role, number> = {
  owner: 100,
  admin: 90,
  editor: 70,
  marketer: 60,
  support: 50,
  viewer: 40,
  user: 10
};

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireRole(minRole: Role) {
  const user = await requireAuth();
  if ((roleRank[user.role] || 0) < roleRank[minRole]) throw new Error("FORBIDDEN");
  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}
