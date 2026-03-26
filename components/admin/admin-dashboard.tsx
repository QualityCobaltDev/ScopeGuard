"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CollectionName } from "@/lib/content-types";
import type { SessionUser } from "@/lib/auth";

type UserRecord = { id: string; username: string; name: string; role: "admin" | "user"; active: boolean; createdAt: string };

const sectionOrder = [
  "Overview",
  "Pages / Website Content",
  "Pricing",
  "Testimonials",
  "FAQ",
  "Products / Offers",
  "Resources",
  "Navigation",
  "Footer",
  "Settings",
  "Profile",
  "Users"
] as const;

const mapSectionToCollection: Partial<Record<(typeof sectionOrder)[number], CollectionName>> = {
  "Pages / Website Content": "site",
  Pricing: "pricing",
  Testimonials: "testimonials",
  FAQ: "faq",
  "Products / Offers": "products",
  Resources: "resources",
  Navigation: "site",
  Footer: "site"
};

export function AdminDashboard({ user }: { user: SessionUser }) {
  const [section, setSection] = useState<(typeof sectionOrder)[number]>("Overview");
  const [selectedCollection, setSelectedCollection] = useState<CollectionName>("site");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [newUser, setNewUser] = useState({ username: "", name: "", password: "", role: "user" as "admin" | "user" });

  async function loadCollection(collection: CollectionName) {
    const res = await fetch(`/api/content/${collection}`);
    setDraft(JSON.stringify(await res.json(), null, 2));
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => {
    const collection = mapSectionToCollection[section];
    if (collection) {
      setSelectedCollection(collection);
      loadCollection(collection);
    }
    if (section === "Users" || section === "Overview") loadUsers();
  }, [section]);

  async function saveContent() {
    setStatus("Saving...");
    const payload = JSON.parse(draft);
    const method = Array.isArray(payload) ? "PUT" : "POST";
    await fetch(`/api/content/${selectedCollection}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method === "PUT" ? { payload } : payload)
    });
    setStatus("Saved successfully.");
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      setNewUser({ username: "", name: "", password: "", role: "user" });
      loadUsers();
      setStatus("New user created.");
    }
  }

  async function updateUserRole(id: string, role: "admin" | "user") {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role })
    });
    loadUsers();
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Delete this user?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    loadUsers();
  }

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/admin/signin";
  }

  const collectionEditable = Boolean(mapSectionToCollection[section]);

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Admin: {user.username}</p>
          <nav className="mt-4 space-y-2">
            {sectionOrder.map((item) => (
              <button key={item} onClick={() => setSection(item)} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${section === item ? "bg-brand text-black" : "border border-border hover:border-brand/60"}`}>
                {item}
              </button>
            ))}
          </nav>
          <button onClick={logout} className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm hover:border-brand/60">Logout</button>
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6">
          {section === "Overview" && (
            <div>
              <h1 className="text-2xl font-semibold">Admin User Board</h1>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Total users</p><p className="text-2xl font-semibold">{users.length || "--"}</p></div>
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Editable modules</p><p className="text-2xl font-semibold">10+</p></div>
                <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">Support</p><p className="text-sm">contact@elevareai.store</p></div>
              </div>
            </div>
          )}

          {collectionEditable && (
            <div>
              <h2 className="text-xl font-semibold">{section}</h2>
              <p className="mt-2 text-sm text-muted">Edit structured content and click Save Changes to publish updates.</p>
              <textarea className="mt-4 h-[520px] w-full rounded-xl border border-border bg-background p-3 font-mono text-xs" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div className="mt-3 flex items-center gap-3">
                <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={saveContent}>Save Changes</button>
                <span className="text-sm text-muted">{status}</span>
              </div>
            </div>
          )}

          {section === "Users" && (
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <form onSubmit={createUser} className="mt-4 grid gap-3 md:grid-cols-4">
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))} required minLength={4} />
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Display name" value={newUser.name} onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))} required />
                <input className="rounded-lg border border-border bg-background px-3 py-2" placeholder="Password" type="password" minLength={8} value={newUser.password} onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))} required />
                <select className="rounded-lg border border-border bg-background px-3 py-2" value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value as "admin" | "user" }))}><option value="user">User</option><option value="admin">Admin</option></select>
                <button className="rounded-lg bg-brand px-4 py-2 font-semibold text-black md:col-span-4">Create New</button>
              </form>
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <table className="min-w-full text-sm"><thead className="bg-white/5"><tr><th className="p-3 text-left">Username</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Actions</th></tr></thead>
                  <tbody>{users.map((u) => <tr key={u.id} className="border-t border-border/70"><td className="p-3">{u.username}</td><td className="p-3">{u.name}</td><td className="p-3"><select value={u.role} className="rounded border border-border bg-background px-2 py-1" onChange={(e) => updateUserRole(u.id, e.target.value as "admin" | "user")}><option value="user">user</option><option value="admin">admin</option></select></td><td className="p-3"><button className="rounded border border-border px-2 py-1" onClick={() => deleteUser(u.id)}>Delete</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {section === "Settings" && <div><h2 className="text-xl font-semibold">Settings</h2><p className="mt-3 text-sm text-muted">Domain is fixed to elevareai.store and contact email is fixed to contact@elevareai.store.</p></div>}
          {section === "Profile" && <div><h2 className="text-xl font-semibold">Profile</h2><p className="mt-3 text-sm text-muted">Admin account: {user.username} ({user.name})</p></div>}
        </section>
      </div>
    </div>
  );
}
