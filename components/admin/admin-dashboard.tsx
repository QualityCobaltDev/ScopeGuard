"use client";

import { Dispatch, FormEvent, ReactNode, SetStateAction, useEffect, useMemo, useState } from "react";
import type { SessionUser } from "@/lib/auth";
import type { FaqItem, PricingTier, ResourceItem, SiteContent, Testimonial } from "@/lib/content-types";
import type { UploadedFileRecord } from "@/lib/file-store";

type UserRecord = { id: string; username: string; name: string; role: "admin" | "user"; active: boolean; createdAt: string };
type Section =
  | "Overview"
  | "Website Content"
  | "Pricing"
  | "Testimonials"
  | "FAQ"
  | "Resources"
  | "Documents / Files"
  | "Email / SMTP"
  | "Navigation"
  | "Footer"
  | "Settings"
  | "Profile"
  | "Users";

const sectionOrder: Section[] = [
  "Overview",
  "Website Content",
  "Pricing",
  "Testimonials",
  "FAQ",
  "Resources",
  "Documents / Files",
  "Navigation",
  "Footer",
  "Settings",
  "Email / SMTP",
  "Profile",
  "Users"
];

const resourceLabels: ResourceItem["label"][] = ["Guide", "Worksheet", "Template", "Checklist", "Download"];

const emptyPricing: PricingTier = {
  id: "",
  name: "",
  label: "",
  price: "",
  description: "",
  includes: [""],
  cta: "",
  ctaUrl: "",
  featured: false,
  audience: "",
  benefit: "",
  sortOrder: 0,
  visible: true
};

export function AdminDashboard({ user }: { user: SessionUser }) {
  const [section, setSection] = useState<Section>("Overview");
  const [status, setStatus] = useState("Ready");

  const [site, setSite] = useState<SiteContent | null>(null);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [files, setFiles] = useState<UploadedFileRecord[]>([]);
  const [uploadInfo, setUploadInfo] = useState<{ allowedExtensions: string[]; maxUploadSizeMb: number } | null>(null);
  const [smtpStatus, setSmtpStatus] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);

  const [newUser, setNewUser] = useState({ username: "", name: "", password: "", role: "user" as "admin" | "user" });

  async function loadCollection<T>(name: string, setter: (value: T) => void) {
    const res = await fetch(`/api/content/${name}`);
    if (res.ok) setter(await res.json());
  }

  async function loadFiles() {
    const res = await fetch("/api/admin/files");
    if (!res.ok) return;
    const data = (await res.json()) as { files: UploadedFileRecord[]; constraints: { allowedExtensions: string[]; maxUploadSizeMb: number } };
    setFiles(data.files);
    setUploadInfo(data.constraints);
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }

  async function loadSmtpStatus() {
    const res = await fetch("/api/admin/email/status");
    if (res.ok) setSmtpStatus(await res.json());
  }

  async function refreshAll() {
    await Promise.all([
      loadCollection<SiteContent>("site", setSite),
      loadCollection<PricingTier[]>("pricing", setPricing),
      loadCollection<Testimonial[]>("testimonials", setTestimonials),
      loadCollection<FaqItem[]>("faq", setFaq),
      loadCollection<ResourceItem[]>("resources", setResources),
      loadFiles(),
      loadUsers(),
      loadSmtpStatus()
    ]);
  }

  useEffect(() => {
    refreshAll();
  }, []);

  async function saveCollection(name: string, payload: unknown) {
    setStatus("Saving changes...");
    const method = Array.isArray(payload) ? "PUT" : "POST";
    const res = await fetch(`/api/content/${name}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method === "PUT" ? { payload } : payload)
    });
    setStatus(res.ok ? "Saved successfully." : "Could not save changes.");
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    if (!res.ok) return setStatus("Failed to create user");
    setNewUser({ username: "", name: "", password: "", role: "user" });
    loadUsers();
    setStatus("New user created.");
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

  const filesById = useMemo(() => new Map(files.map((file) => [file.id, file])), [files]);

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Admin: {user.username}</p>
          <nav className="mt-4 space-y-2">
            {sectionOrder.map((item) => (
              <button
                key={item}
                onClick={() => setSection(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${section === item ? "bg-brand text-black" : "border border-border hover:border-brand/60"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <button onClick={logout} className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm hover:border-brand/60">
            Logout
          </button>
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 text-xs text-muted">{status}</div>

          {section === "Overview" && (
            <div>
              <h1 className="text-2xl font-semibold">ScopeGuard CMS Dashboard</h1>
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <Kpi label="Users" value={String(users.length || 0)} />
                <Kpi label="Resources" value={String(resources.length || 0)} />
                <Kpi label="Uploaded files" value={String(files.length || 0)} />
                <Kpi label="SMTP" value={smtpStatus?.active ? "Active" : "Inactive"} />
              </div>
            </div>
          )}

          {section === "Website Content" && site && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Website Content</h2>
              <Field label="Hero eyebrow" value={site.hero.badge} onChange={(value) => setSite({ ...site, hero: { ...site.hero, badge: value } })} />
              <Field label="Hero heading" value={site.hero.title} onChange={(value) => setSite({ ...site, hero: { ...site.hero, title: value } })} />
              <Area label="Hero subheading" value={site.hero.description} onChange={(value) => setSite({ ...site, hero: { ...site.hero, description: value } })} />
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Primary CTA label" value={site.hero.primaryCtaLabel} onChange={(value) => setSite({ ...site, hero: { ...site.hero, primaryCtaLabel: value } })} />
                <Field label="Primary CTA URL" value={site.hero.primaryCtaLink} onChange={(value) => setSite({ ...site, hero: { ...site.hero, primaryCtaLink: value } })} />
                <Field label="Secondary CTA label" value={site.hero.secondaryCtaLabel} onChange={(value) => setSite({ ...site, hero: { ...site.hero, secondaryCtaLabel: value } })} />
                <Field label="Secondary CTA URL" value={site.hero.secondaryCtaLink} onChange={(value) => setSite({ ...site, hero: { ...site.hero, secondaryCtaLink: value } })} />
              </div>
              <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={() => saveCollection("site", site)}>
                Save website content
              </button>
            </div>
          )}

          {section === "Navigation" && site && (
            <SimpleNavEditor title="Navigation" items={site.nav} onChange={(next) => setSite({ ...site, nav: next })} onSave={() => saveCollection("site", site)} />
          )}

          {section === "Footer" && site && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Footer</h2>
              <Area label="Footer description" value={site.footer.description} onChange={(value) => setSite({ ...site, footer: { ...site.footer, description: value } })} />
              <SimpleNavEditor title="Company links" items={site.footer.companyLinks} onChange={(next) => setSite({ ...site, footer: { ...site.footer, companyLinks: next } })} onSave={() => saveCollection("site", site)} hideSave />
              <SimpleNavEditor title="Legal links" items={site.footer.legalLinks} onChange={(next) => setSite({ ...site, footer: { ...site.footer, legalLinks: next } })} onSave={() => saveCollection("site", site)} hideSave />
              <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={() => saveCollection("site", site)}>
                Save footer
              </button>
            </div>
          )}

          {section === "Pricing" && (
            <ArrayEditor
              title="Pricing plans"
              items={pricing}
              onAdd={() => setPricing([...pricing, { ...emptyPricing, id: `plan-${Date.now()}` }])}
              render={(item, index) => (
                <div className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-4">
                    <Field label="Plan name" value={item.name} onChange={(value) => patchArray(setPricing, index, { name: value })} />
                    <Field label="Display label" value={item.label} onChange={(value) => patchArray(setPricing, index, { label: value })} />
                    <Field label="Price" value={item.price} onChange={(value) => patchArray(setPricing, index, { price: value })} />
                    <Field label="Sort order" type="number" value={String(item.sortOrder ?? 0)} onChange={(value) => patchArray(setPricing, index, { sortOrder: Number(value) || 0 })} />
                  </div>
                  <Area label="Description" value={item.description} onChange={(value) => patchArray(setPricing, index, { description: value })} />
                  <div className="grid gap-2 md:grid-cols-2">
                    <Field label="CTA label" value={item.cta} onChange={(value) => patchArray(setPricing, index, { cta: value })} />
                    <Field label="CTA URL" value={item.ctaUrl || ""} onChange={(value) => patchArray(setPricing, index, { ctaUrl: value })} />
                  </div>
                  <Area label="Feature list (one per line)" value={(item.includes || []).join("\n")} onChange={(value) => patchArray(setPricing, index, { includes: value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="checkbox" checked={item.featured ?? false} onChange={(e) => patchArray(setPricing, index, { featured: e.target.checked })} /> Featured</label>
                    <label><input type="checkbox" checked={item.visible ?? true} onChange={(e) => patchArray(setPricing, index, { visible: e.target.checked })} /> Visible</label>
                    <button className="rounded border border-border px-2 py-1" onClick={() => removeAt(setPricing, index)}>Delete</button>
                  </div>
                </div>
              )}
              onSave={() => saveCollection("pricing", pricing)}
            />
          )}

          {section === "Testimonials" && (
            <ArrayEditor
              title="Testimonials"
              items={testimonials}
              onAdd={() => setTestimonials([...testimonials, { id: `testimonial-${Date.now()}`, quote: "", name: "", role: "", visible: true, sortOrder: testimonials.length + 1 }])}
              render={(item, index) => (
                <div className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-3">
                    <Field label="Name" value={item.name} onChange={(value) => patchArray(setTestimonials, index, { name: value })} />
                    <Field label="Role / company" value={item.role} onChange={(value) => patchArray(setTestimonials, index, { role: value })} />
                    <Field label="Order" type="number" value={String(item.sortOrder ?? 0)} onChange={(value) => patchArray(setTestimonials, index, { sortOrder: Number(value) || 0 })} />
                  </div>
                  <Area label="Testimonial" value={item.quote} onChange={(value) => patchArray(setTestimonials, index, { quote: value })} />
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="checkbox" checked={item.visible ?? true} onChange={(e) => patchArray(setTestimonials, index, { visible: e.target.checked })} /> Visible</label>
                    <button className="rounded border border-border px-2 py-1" onClick={() => removeAt(setTestimonials, index)}>Delete</button>
                  </div>
                </div>
              )}
              onSave={() => saveCollection("testimonials", testimonials)}
            />
          )}

          {section === "FAQ" && (
            <ArrayEditor
              title="FAQ"
              items={faq}
              onAdd={() => setFaq([...faq, { id: `faq-${Date.now()}`, question: "", answer: "", visible: true, sortOrder: faq.length + 1 }])}
              render={(item, index) => (
                <div className="grid gap-2 rounded-xl border border-border p-4">
                  <Field label="Question" value={item.question} onChange={(value) => patchArray(setFaq, index, { question: value })} />
                  <Area label="Answer" value={item.answer} onChange={(value) => patchArray(setFaq, index, { answer: value })} />
                  <div className="flex items-center gap-4 text-sm">
                    <Field label="Order" type="number" value={String(item.sortOrder ?? 0)} onChange={(value) => patchArray(setFaq, index, { sortOrder: Number(value) || 0 })} />
                    <label><input type="checkbox" checked={item.visible ?? true} onChange={(e) => patchArray(setFaq, index, { visible: e.target.checked })} /> Visible</label>
                    <button className="rounded border border-border px-2 py-1" onClick={() => removeAt(setFaq, index)}>Delete</button>
                  </div>
                </div>
              )}
              onSave={() => saveCollection("faq", faq)}
            />
          )}

          {section === "Resources" && (
            <ArrayEditor
              title="Resource entries"
              items={resources}
              onAdd={() =>
                setResources([
                  ...resources,
                  {
                    id: `resource-${Date.now()}`,
                    title: "",
                    category: "General",
                    summary: "",
                    description: "",
                    status: "draft",
                    label: "Guide",
                    ctaLabel: "Download",
                    sortOrder: resources.length + 1,
                    visibility: "public"
                  }
                ])
              }
              render={(item, index) => (
                <div className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => patchArray(setResources, index, { title: value })} />
                    <Field label="Category" value={item.category} onChange={(value) => patchArray(setResources, index, { category: value })} />
                    <Select label="Label" value={item.label} options={resourceLabels} onChange={(value) => patchArray(setResources, index, { label: value as ResourceItem["label"] })} />
                    <Select label="Status" value={item.status} options={["draft", "published"]} onChange={(value) => patchArray(setResources, index, { status: value as "draft" | "published" })} />
                  </div>
                  <Area label="Short summary" value={item.summary} onChange={(value) => patchArray(setResources, index, { summary: value })} />
                  <Area label="Long description" value={item.description || ""} onChange={(value) => patchArray(setResources, index, { description: value })} />
                  <div className="grid gap-2 md:grid-cols-3">
                    <Field label="CTA label" value={item.ctaLabel} onChange={(value) => patchArray(setResources, index, { ctaLabel: value })} />
                    <Field label="External URL (optional)" value={item.externalUrl || ""} onChange={(value) => patchArray(setResources, index, { externalUrl: value })} />
                    <Field label="Sort order" type="number" value={String(item.sortOrder)} onChange={(value) => patchArray(setResources, index, { sortOrder: Number(value) || 0 })} />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Select
                      label="Linked file"
                      value={item.fileId || ""}
                      options={["", ...files.map((file) => file.id)]}
                      optionLabel={(value) => (value ? `${filesById.get(value)?.title || "Untitled"} (${filesById.get(value)?.originalName || "file"})` : "No file selected")}
                      onChange={(value) => patchArray(setResources, index, { fileId: value || undefined })}
                    />
                    <Select label="Visibility" value={item.visibility} options={["public", "gated", "internal"]} onChange={(value) => patchArray(setResources, index, { visibility: value as ResourceItem["visibility"] })} />
                  </div>
                  <button className="w-fit rounded border border-border px-2 py-1" onClick={() => removeAt(setResources, index)}>Delete</button>
                </div>
              )}
              onSave={() => saveCollection("resources", resources)}
            />
          )}

          {section === "Documents / Files" && (
            <DocumentManager
              files={files}
              uploadInfo={uploadInfo}
              onRefresh={async () => {
                await loadFiles();
                await loadCollection<ResourceItem[]>("resources", setResources);
              }}
            />
          )}

          {section === "Email / SMTP" && <EmailSettings status={smtpStatus} onRefresh={loadSmtpStatus} setStatus={setStatus} />}

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

          {section === "Settings" && <div><h2 className="text-xl font-semibold">Settings</h2><p className="mt-3 text-sm text-muted">Domain: https://elevareai.store. Contact email: contact@elevareai.store.</p></div>}
          {section === "Profile" && <div><h2 className="text-xl font-semibold">Profile</h2><p className="mt-3 text-sm text-muted">Admin account: {user.username} ({user.name})</p></div>}
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">{label}</p><p className="text-2xl font-semibold">{value}</p></div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><input type={type} className="rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><textarea className="min-h-24 rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Select({ label, value, options, onChange, optionLabel }: { label: string; value: string; options: string[]; onChange: (v: string) => void; optionLabel?: (v: string) => string }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><select className="rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option} value={option}>{optionLabel ? optionLabel(option) : option}</option>)}</select></label>;
}

function ArrayEditor<T>({ title, items, render, onAdd, onSave }: { title: string; items: T[]; render: (item: T, index: number) => ReactNode; onAdd: () => void; onSave: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={onAdd}>Add item</button>
      </div>
      <div className="space-y-3">{items.map(render)}</div>
      <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={onSave}>Save {title}</button>
    </div>
  );
}

function patchArray<T>(setter: Dispatch<SetStateAction<T[]>>, index: number, patch: Partial<T>) {
  setter((current) => current.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
}

function removeAt<T>(setter: Dispatch<SetStateAction<T[]>>, index: number) {
  setter((current) => current.filter((_, idx) => idx !== index));
}

function SimpleNavEditor({ title, items, onChange, onSave, hideSave }: { title: string; items: { label: string; href: string }[]; onChange: (next: { label: string; href: string }[]) => void; onSave: () => void; hideSave?: boolean }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-2">
          <Field label="Label" value={item.label} onChange={(value) => onChange(items.map((entry, idx) => (idx === index ? { ...entry, label: value } : entry)))} />
          <Field label="URL" value={item.href} onChange={(value) => onChange(items.map((entry, idx) => (idx === index ? { ...entry, href: value } : entry)))} />
        </div>
      ))}
      <button className="w-fit rounded border border-border px-3 py-2" onClick={() => onChange([...items, { label: "", href: "/" }])}>Add link</button>
      {!hideSave && <button className="block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={onSave}>Save {title}</button>}
    </div>
  );
}

function DocumentManager({ files, uploadInfo, onRefresh }: { files: UploadedFileRecord[]; uploadInfo: { allowedExtensions: string[]; maxUploadSizeMb: number } | null; onRefresh: () => Promise<void> }) {
  const [uploading, setUploading] = useState(false);

  async function upload(form: FormData) {
    setUploading(true);
    await fetch("/api/admin/files", { method: "POST", body: form });
    await onRefresh();
    setUploading(false);
  }

  async function replace(id: string, file: File) {
    const form = new FormData();
    form.set("id", id);
    form.set("file", file);
    await fetch("/api/admin/files", { method: "PUT", body: form });
    await onRefresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this uploaded file?")) return;
    await fetch("/api/admin/files", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await onRefresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Documents / Files</h2>
      <form
        className="grid gap-3 rounded-xl border border-border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          upload(new FormData(e.currentTarget));
          e.currentTarget.reset();
        }}
      >
        <label className="grid gap-1 text-sm">
          <span className="text-muted">Upload document</span>
          <input required type="file" name="file" className="rounded-lg border border-border bg-background px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm"><span className="text-muted">Display title</span><input required name="title" className="rounded-lg border border-border bg-background px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="text-muted">Short description</span><textarea name="description" className="rounded-lg border border-border bg-background px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="text-muted">Visibility</span><select name="visibility" className="rounded-lg border border-border bg-background px-3 py-2"><option value="public">Public</option><option value="gated">Gated</option><option value="internal">Internal</option></select></label>
        <p className="text-xs text-muted">Allowed: {uploadInfo?.allowedExtensions.join(", ")} · Max size: {uploadInfo?.maxUploadSizeMb ?? 15}MB</p>
        <button disabled={uploading} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black">{uploading ? "Uploading..." : "Upload document"}</button>
      </form>

      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-medium">{file.title}</p>
              <p className="text-xs text-muted">{file.originalName} · {Math.round(file.size / 1024)} KB · {new Date(file.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-muted">{file.mimeType} · {file.visibility}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={file.publicUrl} target="_blank" className="rounded border border-border px-2 py-1 text-xs">Open</a>
              <label className="cursor-pointer rounded border border-border px-2 py-1 text-xs">Replace<input type="file" className="hidden" onChange={(e) => { const next = e.target.files?.[0]; if (next) replace(file.id, next); }} /></label>
              <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => remove(file.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailSettings({ status, onRefresh, setStatus }: { status: Record<string, unknown> | null; onRefresh: () => Promise<void>; setStatus: (value: string) => void }) {
  const [recipient, setRecipient] = useState("contact@elevareai.store");
  const [loading, setLoading] = useState(false);

  async function sendTest() {
    setLoading(true);
    const res = await fetch("/api/admin/email/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipient })
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    setStatus(data.message || (res.ok ? "SMTP test sent" : "SMTP test failed"));
    setLoading(false);
    await onRefresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Email / SMTP</h2>
      <div className="rounded-xl border border-border p-4 text-sm">
        <p><strong>Status:</strong> {status?.active ? "Active" : "Inactive"}</p>
        <p><strong>Host:</strong> {String(status?.host || "mail.spacemail.com")}</p>
        <p><strong>Port:</strong> {String(status?.port || 465)}</p>
        <p><strong>Secure SSL:</strong> {String(status?.secure ? "Yes" : "No")}</p>
        <p><strong>SMTP user:</strong> {String(status?.username || "contact@elevareai.store")}</p>
        <p><strong>Password:</strong> {String(status?.passwordMasked || "Not set")}</p>
      </div>
      <label className="grid gap-1 text-sm"><span className="text-muted">Send test email to</span><input className="rounded-lg border border-border bg-background px-3 py-2" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></label>
      <button disabled={loading} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={sendTest}>{loading ? "Sending..." : "Send test email"}</button>
    </div>
  );
}
