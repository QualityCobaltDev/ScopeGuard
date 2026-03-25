"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CollectionName } from "@/lib/content-types";
import type { SessionUser } from "@/lib/auth";

type UserRecord = { id: string; name: string; email: string; role: "admin" | "user"; active: boolean; createdAt: string };

const contentSections: { key: CollectionName; label: string }[] = [
  { key: "site", label: "Website Content" },
  { key: "pricing", label: "Pricing" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "products", label: "Products" },
  { key: "resources", label: "Resources" }
];

export function AdminDashboard({ user }: { user: SessionUser }) {
  const [section, setSection] = useState("overview");
  const [selectedCollection, setSelectedCollection] = useState<CollectionName>("site");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" as "admin" | "user" });

  async function loadCollection(collection: CollectionName) {
    const res = await fetch(`/api/content/${collection}`);
    setDraft(JSON.stringify(await res.json(), null, 2));
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => { loadCollection(selectedCollection); }, [selectedCollection]);
  useEffect(() => { if (section === "users") loadUsers(); }, [section]);

  async function saveContent() {
    setStatus("Saving...");
    const payload = JSON.parse(draft);
    const method = Array.isArray(payload) ? "PUT" : "POST";
    await fetch(`/api/content/${selectedCollection}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(method === "PUT" ? { payload } : payload) });
    setStatus("Saved.");
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
    if (res.ok) {
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    }
  }

  async function updateUserRole(id: string, role: "admin" | "user") {
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role }) });
    loadUsers();
  }

  async function deleteUser(id: string) {
    await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadUsers();
  }

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/signin";
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Signed in as {user.email}</p>
          <nav className="mt-4 space-y-2">
            {[
              ["overview", "Overview"],
              ["content", "Content"],
              ["users", "Users"],
              ["settings", "Settings"],
              ["profile", "Profile"]
            ].map(([key, label]) => (
              <button key={key} onClick={() => setSection(key)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${section === key ? "bg-brand text-black" : "border border-border"}`}>{label}</button>
            ))}
          </nav>
          <button onClick={logout} className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm">Logout</button>
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6">
          {section === "overview" ? (
            <div>
              <h1 className="text-2xl font-semibold">Admin Overview</h1>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Total users</p><p className="text-2xl font-semibold">{users.length || "--"}</p></div>
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Editable collections</p><p className="text-2xl font-semibold">6</p></div>
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Support</p><p className="text-sm">contact@elevareai.store</p></div>
              </div>
            </div>
          ) : null}

          {section === "content" ? (
            <div>
              <h2 className="text-xl font-semibold">Content Manager</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {contentSections.map((item) => (
                  <button key={item.key} onClick={() => setSelectedCollection(item.key)} className={`rounded-lg px-3 py-2 text-sm ${selectedCollection === item.key ? "bg-brand text-black" : "border border-border"}`}>{item.label}</button>
                ))}
              </div>
              <textarea className="mt-4 h-[480px] w-full rounded-xl border border-border bg-background p-3 font-mono text-xs" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div className="mt-3 flex items-center gap-3"><button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={saveContent}>Save</button><span className="text-sm text-muted">{status}</span></div>
            </div>
          ) : null}

          {section === "users" ? (
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <form onSubmit={createUser} className="mt-4 grid gap-3 md:grid-cols-4">
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))} required />
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Email" type="email" value={newUser.email} onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))} required />
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Password" type="password" minLength={8} value={newUser.password} onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))} required />
                <select className="rounded-lg border border-border bg-background px-3 py-2" value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value as "admin" | "user" }))}><option value="user">User</option><option value="admin">Admin</option></select>
                <button className="rounded-lg bg-brand px-4 py-2 font-semibold text-black md:col-span-4">Create user</button>
              </form>

              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <table className="min-w-full text-sm"><thead className="bg-white/5"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Actions</th></tr></thead>
                <tbody>{users.map((u) => <tr key={u.id} className="border-t border-border/70"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3"><select value={u.role} className="rounded border border-border bg-background px-2 py-1" onChange={(e) => updateUserRole(u.id, e.target.value as "admin" | "user")}><option value="user">user</option><option value="admin">admin</option></select></td><td className="p-3"><button className="rounded border border-border px-2 py-1" onClick={() => deleteUser(u.id)}>Delete</button></td></tr>)}</tbody></table>
              </div>
            </div>
          ) : null}

          {section === "settings" ? <div><h2 className="text-xl font-semibold">Settings</h2><p className="mt-3 text-sm text-muted">Primary domain is locked to elevareai.store. Contact email is locked to contact@elevareai.store.</p></div> : null}
          {section === "profile" ? <div><h2 className="text-xl font-semibold">Profile</h2><p className="mt-3 text-sm text-muted">Admin: {user.name} ({user.email})</p></div> : null}
        </section>
      </div>
    </div>
  );
}
