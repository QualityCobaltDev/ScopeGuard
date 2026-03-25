"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("Signing in...");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.message || "Sign in failed");
      return;
    }

    const next = params.get("next");
    if (next) router.push(next);
    else router.push(data.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <div>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8} />
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="mt-1 text-xs text-muted">{showPassword ? "Hide" : "Show"} password</button>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
      <button className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-black">Sign in</button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
