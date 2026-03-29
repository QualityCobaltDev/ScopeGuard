"use client";

import { LinkButton } from "@/components/ui/button";
import { isAdminRole, type SessionUser } from "@/lib/auth";

export function SessionActions({
  user,
  mobile = false,
  onAction
}: {
  user: SessionUser;
  mobile?: boolean;
  onAction?: () => void;
}) {
  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    onAction?.();
    window.location.href = "/";
  }

  return (
    <div className={`flex ${mobile ? "flex-col items-stretch" : "items-center"} gap-2`}>
      <LinkButton href={isAdminRole(user.role) ? "/admin" : "/dashboard"} size="sm" onClick={onAction} className={mobile ? "h-11 w-full" : undefined}>
        {isAdminRole(user.role) ? "Admin Dashboard" : "Dashboard"}
      </LinkButton>
      <button
        onClick={logout}
        className={`rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-brand/60 ${mobile ? "h-11 w-full" : ""}`}
      >
        Logout
      </button>
    </div>
  );
}
