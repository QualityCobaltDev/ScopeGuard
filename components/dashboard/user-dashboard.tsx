"use client";

import { FormEvent, useState } from "react";
import type { SessionUser } from "@/lib/auth";

export function UserDashboard({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    setStatus(res.ok ? "Profile updated." : "Unable to update profile.");
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
    const data = await res.json();
    setStatus(res.ok ? "Password updated." : data.message || "Unable to update password.");
  }

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/admin/signin";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
        <p className="mt-2 text-sm text-muted">Manage your account and prepare for future modules: downloads, orders, saved resources, and notifications.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={saveProfile} className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <input className="w-full rounded-lg border border-border bg-background px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-muted" value={user.username} readOnly />
          <button className="rounded-lg bg-brand px-4 py-2 font-medium text-black">Save profile</button>
        </form>
        <form onSubmit={changePassword} className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">Change password</h2>
          <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required minLength={8} />
          <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
          <button className="rounded-lg border border-border px-4 py-2">Update password</button>
        </form>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted">Need help? contact@elevareai.store</p>
        <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={logout}>Logout</button>
      </div>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}
