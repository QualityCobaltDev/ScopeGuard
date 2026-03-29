"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAdminRole, type Role } from "@/lib/auth";

export function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("Signing in...");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.message || "Sign in failed");
      setLoading(false);
      return;
    }

    const next = params.get("next");
    router.push(next || (isAdminRole(data.role as Role) ? "/admin" : "/dashboard"));
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required minLength={4} />
      <div>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8} />
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="mt-1 text-xs text-muted">{showPassword ? "Hide" : "Show"} password</button>
      </div>
      <button disabled={loading} className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-black disabled:opacity-60">{loading ? "Signing in..." : "Admin Sign-in"}</button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
