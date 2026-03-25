"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      setError("Invalid credentials.");
      return;
    }
    window.location.reload();
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-md space-y-4 rounded-2xl border border-border bg-card p-8">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="text-sm text-muted">Internal access only.</p>
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-black">Sign in</button>
    </form>
  );
}
