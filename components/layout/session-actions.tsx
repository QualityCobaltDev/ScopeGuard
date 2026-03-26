"use client";

import { LinkButton } from "@/components/ui/button";
import type { SessionUser } from "@/lib/auth";

export function SessionActions({ user }: { user: SessionUser }) {
  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="flex items-center gap-2">
      <LinkButton href={user.role === "admin" ? "/admin" : "/dashboard"} size="sm">
        {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
      </LinkButton>
      <button onClick={logout} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-brand/60">
        Logout
      </button>
    </div>
  );
}
