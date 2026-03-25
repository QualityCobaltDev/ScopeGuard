"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("Creating account...");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) return setStatus(data.message || "Sign up failed");
    setStatus("Success. Redirecting...");
    router.push(data.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required minLength={2} />
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8} />
      <button className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-black">Create account</button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
