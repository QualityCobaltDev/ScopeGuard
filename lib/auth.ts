export type Role = "owner" | "admin" | "editor" | "marketer" | "viewer" | "support" | "user";
export type SessionUser = { id: string; username: string; name: string; role: Role };

export function isAdminRole(role: Role): boolean {
  return role === "owner" || role === "admin";
}
