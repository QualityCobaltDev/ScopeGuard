"use client";

import { Dispatch, FormEvent, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import type { AnalyticsEvent } from "@/lib/analytics-store";
import type { ContentPost, ManagedPage, PageSectionBlock } from "@/lib/cms-store";
import type { FaqItem, PricingTier, ResourceItem, SiteContent, Testimonial } from "@/lib/content-types";
import type { UploadedFileRecord } from "@/lib/file-store";
import type { LeadMagnetSettings, LeadSubscriber } from "@/lib/lead-magnet-store";

type UserRecord = { id: string; username: string; name: string; role: "admin" | "user"; active: boolean; createdAt: string };
type LeadMetrics = { totalSubmissions: number; sent: number; failed: number; lastSubmissionAt: string | null };
type OverviewMetrics = {
  users: number;
  resourcesTotal: number;
  resourcesPublished: number;
  resourcesHidden: number;
  files: number;
  smtpActive: boolean;
  smtpLastTest: string | null;
  leadMagnetActive: boolean;
  subscribers: number;
  subscriberSent: number;
  pricingVisible: number;
  faqVisible: number;
  testimonialsVisible: number;
  sectionsTotal: number;
  sectionsVisible: number;
  pagesTotal: number;
  pagesPublished: number;
  pagesHidden: number;
  navItems: number;
  footerLinks: number;
};
type AnalyticsSummary = {
  pageViews: number;
  leadOptIns: number;
  resourceDownloads: number;
  ctaClicks: number;
  recent: AnalyticsEvent[];
};
type Section =
  | "Overview"
  | "Website Content"
  | "Pricing"
  | "Testimonials"
  | "FAQ"
  | "Resources"
  | "Lead Magnet"
  | "Subscribers"
  | "Pages"
  | "Analytics"
  | "Posts"
  | "Page Sections"
  | "Documents / Files"
  | "Email / SMTP"
  | "Navigation"
  | "Footer"
  | "Settings"
  | "Profile"
  | "Users";

const sectionGroups: { heading: string; sections: Section[] }[] = [
  { heading: "Control Center", sections: ["Overview"] },
  { heading: "Content", sections: ["Website Content", "Pages", "Page Sections", "Posts", "Navigation", "Footer"] },
  { heading: "Commerce / Product", sections: ["Pricing", "Testimonials", "Resources", "Lead Magnet", "Documents / Files"] },
  { heading: "Audience / Operations", sections: ["Subscribers", "Analytics", "Email / SMTP"] },
  { heading: "System / Account", sections: ["Settings", "Users", "Profile"] }
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

function normalizeLocalizedValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => normalizeLocalizedValue(item)) as T;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record);
    const localeKeys = keys.filter((key) => key === "en" || key === "km");
    if (localeKeys.length && localeKeys.length === keys.length) {
      return String(record.en || "") as T;
    }
    const next: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(record)) next[key] = normalizeLocalizedValue(entry);
    return next as T;
  }
  return value;
}

export function AdminDashboard({ user }: { user: SessionUser }) {
  const [section, setSection] = useState<Section>("Overview");
  const [status, setStatus] = useState("Ready");
  const [syncingSite, setSyncingSite] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [site, setSite] = useState<SiteContent | null>(null);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [files, setFiles] = useState<UploadedFileRecord[]>([]);
  const [uploadInfo, setUploadInfo] = useState<{ allowedExtensions: string[]; maxUploadSizeMb: number } | null>(null);
  const [smtpStatus, setSmtpStatus] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnetSettings | null>(null);
  const [leadMagnetResources, setLeadMagnetResources] = useState<ResourceItem[]>([]);
  const [leadSubscribers, setLeadSubscribers] = useState<LeadSubscriber[]>([]);
  const [leadMetrics, setLeadMetrics] = useState<LeadMetrics | null>(null);
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [pageSections, setPageSections] = useState<PageSectionBlock[]>([]);
  const [managedPages, setManagedPages] = useState<ManagedPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const [newUser, setNewUser] = useState({ username: "", name: "", password: "", role: "user" as "admin" | "user" });

  const loadCollection = useCallback(async <T,>(name: string, setter: (value: T) => void) => {
    const res = await fetch(`/api/content/${name}`);
    if (res.ok) setter(normalizeLocalizedValue(await res.json()));
  }, []);

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

  const loadLeadMagnet = useCallback(async () => {
    const res = await fetch("/api/admin/lead-magnet");
    if (!res.ok) return;
    const data = (await res.json()) as { settings: LeadMagnetSettings; resources?: ResourceItem[]; metrics?: LeadMetrics | null };
    setLeadMagnet(normalizeLocalizedValue(data.settings));
    setLeadMagnetResources(data.resources || []);
    setLeadMetrics(data.metrics || null);
  }, []);

  async function loadLeadSubscribers() {
    const res = await fetch("/api/admin/lead-subscribers");
    if (!res.ok) return;
    const data = (await res.json()) as { subscribers?: LeadSubscriber[] };
    setLeadSubscribers(data.subscribers || []);
  }

  async function loadOverview() {
    const res = await fetch("/api/admin/overview");
    if (res.ok) setOverview((await res.json()) as OverviewMetrics);
  }

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/admin/posts");
    if (res.ok) setPosts(normalizeLocalizedValue((await res.json()) as ContentPost[]));
  }, []);


  async function loadAnalytics() {
    const res = await fetch("/api/admin/analytics");
    if (res.ok) setAnalytics((await res.json()) as AnalyticsSummary);
  }

  const loadManagedPages = useCallback(async () => {
    const res = await fetch("/api/admin/pages");
    if (res.ok) {
      const data = (await res.json()) as ManagedPage[];
      setManagedPages(normalizeLocalizedValue(data));
      if (data.length) setSelectedPageId((current) => current || data[0].id);
    }
  }, []);

  const loadPageSections = useCallback(async () => {
    const res = await fetch("/api/admin/page-sections");
    if (!res.ok) return;
    const data = (await res.json()) as { sections?: PageSectionBlock[] };
    setPageSections(normalizeLocalizedValue(data.sections || []));
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadCollection<SiteContent>("site", setSite),
      loadCollection<PricingTier[]>("pricing", setPricing),
      loadCollection<Testimonial[]>("testimonials", setTestimonials),
      loadCollection<FaqItem[]>("faq", setFaq),
      loadCollection<ResourceItem[]>("resources", setResources),
      loadFiles(),
      loadUsers(),
      loadSmtpStatus(),
      loadLeadMagnet(),
      loadLeadSubscribers(),
      loadOverview(),
      loadPosts(),
      loadManagedPages(),
      loadAnalytics(),
      loadPageSections()
    ]);
  }, [loadCollection, loadLeadMagnet, loadManagedPages, loadPageSections, loadPosts]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  async function saveCollection(name: string, payload: unknown) {
    setStatus("Saving changes...");
    const method = Array.isArray(payload) ? "PUT" : "POST";
    const res = await fetch(`/api/content/${name}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method === "PUT" ? { payload } : payload)
    });
    setStatus(res.ok ? "Saved successfully." : "Could not save changes.");
    if (res.ok) await refreshAll();
  }

  async function syncSite() {
    setSyncingSite(true);
    setStatus("Syncing website cache and revalidation...");
    const res = await fetch("/api/admin/site-sync", { method: "POST" });
    setSyncingSite(false);
    if (!res.ok) {
      setStatus("Could not sync site right now.");
      return;
    }
    setStatus("Site refreshed successfully.");
    await refreshAll();
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
  const scopedSections = useMemo(
    () =>
      pageSections
        .map((item, originalIndex) => ({ item, originalIndex }))
        .filter((entry) => !selectedPageId || entry.item.pageId === selectedPageId)
        .sort((a, b) => (a.item.order || 0) - (b.item.order || 0)),
    [pageSections, selectedPageId]
  );

  return (
    <div className="container py-4 sm:py-6 md:py-8">
      <div className="mb-3 flex items-center justify-between gap-2 lg:hidden">
        <p className="text-sm text-muted">Admin: {user.username}</p>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
          aria-label={mobileNavOpen ? "Close admin sections" : "Open admin sections"}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileNavOpen ? <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-label="Close admin menu" onClick={() => setMobileNavOpen(false)} /> : null}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={`rounded-2xl border border-border bg-card p-4 ${mobileNavOpen ? "fixed inset-x-3 top-16 z-50 max-h-[70vh] overflow-y-auto" : "hidden lg:block"}`}>
          <p className="text-sm text-muted">Admin: {user.username}</p>
          <nav className="mt-4 space-y-4">
            {sectionGroups.map((group) => (
              <div key={group.heading}>
                <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.14em] text-muted">{group.heading}</p>
                <div className="space-y-2">
                  {group.sections.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSection(item);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${section === item ? "bg-brand text-black" : "border border-border hover:border-brand/60"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <button onClick={logout} className="mt-6 min-h-11 w-full rounded-lg border border-border px-3 py-2 text-sm hover:border-brand/60">
            Logout
          </button>
        </aside>

        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6">
          <div className="mb-4 text-xs text-muted">{status}</div>

          {section === "Overview" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold">ScopeGuard CMS Dashboard</h1>
                  <p className="mt-1 text-sm text-muted">Unified operations hub for multilingual content, publishing, and system health.</p>
                </div>
                {user.role === "admin" ? (
                  <button
                    type="button"
                    onClick={syncSite}
                    disabled={syncingSite}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {syncingSite ? "Syncing…" : "Sync Website"}
                  </button>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <Kpi label="Users" value={String(overview?.users ?? users.length ?? 0)} />
                <Kpi label="Subscribers" value={String(overview?.subscribers ?? 0)} />
                <Kpi label="Resources" value={String(overview?.resourcesTotal ?? resources.length ?? 0)} />
                <Kpi label="Uploaded files" value={String(overview?.files ?? files.length ?? 0)} />
                <Kpi label="SMTP" value={overview?.smtpActive ? "Healthy" : "Needs setup"} />
                <Kpi label="Lead Magnet" value={overview?.leadMagnetActive ? "Active" : "Paused"} />
                <Kpi label="Visible sections" value={`${overview?.sectionsVisible ?? 0}/${overview?.sectionsTotal ?? 0}`} />
                <Kpi label="Published resources" value={String(overview?.resourcesPublished ?? 0)} />
                <Kpi label="Pages" value={String(overview?.pagesTotal ?? 0)} />
                <Kpi label="Published pages" value={String(overview?.pagesPublished ?? 0)} />
                <Kpi label="Localized nav labels" value={String(0)} />
                <Kpi label="Localized pricing plans" value={String(0)} />
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
                    <Select label="Access" value={item.accessType || "public"} options={["public", "account_required", "hidden"]} onChange={(value) => patchArray(setResources, index, { accessType: value as NonNullable<ResourceItem["accessType"]> })} />
                    <Select label="Linked post" value={(item).linkedPostId || ""} options={["", ...posts.map((post) => post.id)]} optionLabel={(value) => (value ? posts.find((post) => post.id === value)?.title || value : "No linked post")} onChange={(value) => patchArray(setResources, index, { linkedPostId: value || undefined })} />
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

          {section === "Lead Magnet" && leadMagnet && (
            <LeadMagnetManager
              settings={leadMagnet}
              resources={leadMagnetResources}
              metrics={leadMetrics}
              onSaved={async () => {
                await loadLeadMagnet();
                setStatus("Lead magnet settings saved.");
              }}
            />
          )}

          {section === "Subscribers" && (
            <SubscriberManager
              subscribers={leadSubscribers}
              onRefresh={loadLeadSubscribers}
              setStatus={setStatus}
            />
          )}

          {section === "Pages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Pages</h2>
                  <p className="text-sm text-muted">Create, publish, hide, and manage metadata for any managed page.</p>
                </div>
                <button
                  className="rounded border border-border px-3 py-2 text-sm"
                  onClick={() =>
                    setManagedPages([
                      ...managedPages,
                      {
                        id: `page-${Date.now()}`,
                        title: "",
                        internalName: "",
                        slug: "",
                        pageKey: `page-${managedPages.length + 1}`,
                        pageType: "standard",
                        seoTitle: "",
                        seoDescription: "",
                        ogTitle: "",
                        ogDescription: "",
                        isPublished: false,
                        isVisible: true,
                        showInNavigation: false,
                        isSystemPage: false,
                        sortOrder: managedPages.length + 1,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      }
                    ])
                  }
                >
                  Add page
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Total pages" value={String(managedPages.length)} />
                <Kpi label="Published" value={String(managedPages.filter((p) => p.isPublished).length)} />
                <Kpi label="Visible" value={String(managedPages.filter((p) => p.isVisible).length)} />
                <Kpi label="In navigation" value={String(managedPages.filter((p) => p.showInNavigation).length)} />
              </div>
              {managedPages.map((page, index) => (
                <div key={page.id} className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full border px-2 py-0.5 ${page.isPublished ? "border-emerald-500/60 text-emerald-300" : "border-amber-500/60 text-amber-300"}`}>{page.isPublished ? "Published" : "Draft"}</span>
                    <span className={`rounded-full border px-2 py-0.5 ${page.isVisible ? "border-sky-500/60 text-sky-300" : "border-zinc-500/60 text-zinc-300"}`}>{page.isVisible ? "Visible" : "Hidden"}</span>
                    {page.isSystemPage ? <span className="rounded-full border border-purple-500/60 px-2 py-0.5 text-purple-300">System</span> : null}
                    <span className="rounded-full border border-border px-2 py-0.5 text-muted">{page.pageType || "standard"}</span>
                    {page.slug ? <a className="underline" href={`/${page.slug}`} target="_blank">View live</a> : null}
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <Field label="Page title" value={page.title || ""} onChange={(value) => patchArray(setManagedPages, index, { title: value })} />
                    <Field label="Internal name" value={page.internalName || ""} onChange={(value) => patchArray(setManagedPages, index, { internalName: value })} />
                    <Field label="Slug" value={page.slug || ""} onChange={(value) => patchArray(setManagedPages, index, { slug: value.replace(/^\//, "") })} />
                    <Field label="Page key" value={page.pageKey || ""} onChange={(value) => patchArray(setManagedPages, index, { pageKey: value })} />
                    <Select label="Page type" value={page.pageType || "standard"} options={["standard", "landing", "resource", "legal", "post"]} onChange={(value) => patchArray(setManagedPages, index, { pageType: value as ManagedPage["pageType"] })} />
                    <Field label="Sort order" type="number" value={String(page.sortOrder || 0)} onChange={(value) => patchArray(setManagedPages, index, { sortOrder: Number(value) || 0 })} />
                    <Field label="SEO title" value={page.seoTitle || ""} onChange={(value) => patchArray(setManagedPages, index, { seoTitle: value })} />
                    <Field label="SEO description" value={page.seoDescription || ""} onChange={(value) => patchArray(setManagedPages, index, { seoDescription: value })} />
                    <Field label="OG title" value={page.ogTitle || ""} onChange={(value) => patchArray(setManagedPages, index, { ogTitle: value })} />
                    <Field label="OG description" value={page.ogDescription || ""} onChange={(value) => patchArray(setManagedPages, index, { ogDescription: value })} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <label><input type="checkbox" checked={Boolean(page.isPublished)} onChange={(e) => patchArray(setManagedPages, index, { isPublished: e.target.checked })} /> Published</label>
                    <label><input type="checkbox" checked={Boolean(page.isVisible)} onChange={(e) => patchArray(setManagedPages, index, { isVisible: e.target.checked })} /> Visible</label>
                    <label><input type="checkbox" checked={Boolean(page.showInNavigation)} onChange={(e) => patchArray(setManagedPages, index, { showInNavigation: e.target.checked })} /> Show in navigation</label>
                    <button
                      className="rounded border border-border px-2 py-1"
                      onClick={() =>
                        setManagedPages((current) => {
                          const source = current[index];
                          const duplicate = {
                            ...source,
                            id: `page-${Date.now()}`,
                            isSystemPage: false,
                            slug: `${source.slug || source.pageKey || "page"}-copy-${Date.now().toString().slice(-4)}`,
                            pageKey: `${source.pageKey || "page"}-copy-${Date.now().toString().slice(-4)}`,
                            title: `${source.title || "Untitled"} (Copy)`,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          return [...current, duplicate];
                        })
                      }
                    >
                      Duplicate
                    </button>
                    <button className="rounded border border-border px-2 py-1" onClick={async () => {
                      if (page.isSystemPage) return alert("System pages cannot be deleted.");
                      if (!window.confirm("Delete this page and all its sections?")) return;
                      await fetch("/api/admin/pages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageId: page.id }) });
                      await loadManagedPages();
                      await loadPageSections();
                      await loadOverview();
                    }}>Delete</button>
                  </div>
                  <p className="text-xs text-muted">Route preview: /{page.slug || "new-page"}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={async () => {
                  await fetch("/api/admin/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload: managedPages }) });
                  setStatus("Pages saved.");
                  await loadManagedPages();
                  await loadOverview();
                }}>Save pages</button>
              </div>
            </div>
          )}

          {section === "Analytics" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Analytics (last 30 days)</h2>
              <div className="grid gap-4 md:grid-cols-4">
                <Kpi label="Page views" value={String(analytics?.pageViews || 0)} />
                <Kpi label="Lead opt-ins" value={String(analytics?.leadOptIns || 0)} />
                <Kpi label="Resource downloads" value={String(analytics?.resourceDownloads || 0)} />
                <Kpi label="CTA clicks" value={String(analytics?.ctaClicks || 0)} />
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-sm font-medium">Recent events</p>
                <div className="space-y-1 text-xs text-muted">
                  {(analytics?.recent || []).map((event) => <p key={event.id}>{event.type} · {event.key} · {new Date(event.at).toLocaleString()}</p>)}
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-sm font-medium">Recent events</p>
                <div className="space-y-1 text-xs text-muted">
                  {(analytics?.recent || []).map((event) => <p key={event.id}>{event.type} · {event.key} · {new Date(event.at).toLocaleString()}</p>)}
                </div>
              </div>
              <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={() => saveCollection("site", site)}>
                Save website content
              </button>
            </div>
          )}

          {section === "Posts" && (
            <ArrayEditor
              title="Content posts"
              items={posts}
              onAdd={() =>
                setPosts([...posts, { id: `post-${Date.now()}`, slug: "", title: "", excerpt: "", body: "", isPublished: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])
              }
              render={(item, index) => (
                <div className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Field label="Title" value={item.title || ""} onChange={(value) => patchArray(setPosts, index, { title: value })} />
                    <Field label="Slug" value={item.slug || ""} onChange={(value) => patchArray(setPosts, index, { slug: value })} />
                  </div>
                  <Area label="Excerpt" value={item.excerpt || ""} onChange={(value) => patchArray(setPosts, index, { excerpt: value })} />
                  <Area label="Body" value={item.body || ""} onChange={(value) => patchArray(setPosts, index, { body: value })} />
                  <label className="text-sm"><input type="checkbox" checked={Boolean(item.isPublished)} onChange={(e) => patchArray(setPosts, index, { isPublished: e.target.checked })} /> Published</label>
                  <button className="w-fit rounded border border-border px-2 py-1" onClick={() => removeAt(setPosts, index)}>Delete</button>
                </div>
              )}
              onSave={async () => {
                await fetch("/api/admin/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload: posts }) });
                setStatus("Posts saved.");
                await loadOverview();
              }}
            />
          )}

          {section === "Page Sections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Page sections</h2>
                  <p className="text-sm text-muted">Manage modular blocks for each page. Order and visibility control live rendering.</p>
                </div>
                <button
                  className="rounded border border-border px-3 py-2 text-sm"
                  onClick={() =>
                    setPageSections([
                      ...pageSections,
                      {
                        id: `section-${Date.now()}`,
                        pageId: selectedPageId || managedPages[0]?.id || "",
                        pageKey: managedPages.find((p) => p.id === selectedPageId)?.pageKey || "",
                        sectionType: "Custom Info Block",
                        title: "",
                        subtitle: "",
                        body: "",
                        ctaText: "",
                        ctaUrl: "",
                        order: scopedSections.length + 1,
                        visible: true,
                        updatedAt: new Date().toISOString()
                      }
                    ])
                  }
                >
                  Add section
                </button>
              </div>
              <Select
                label="Editing sections for page"
                value={selectedPageId || managedPages[0]?.id || ""}
                options={managedPages.map((page) => page.id)}
                optionLabel={(value) => {
                  const page = managedPages.find((entry) => entry.id === value);
                  return page ? `${page.title || page.internalName || page.slug || value} (${page.slug || "no-slug"})` : value;
                }}
                onChange={(value) => setSelectedPageId(value)}
              />
              {scopedSections.map(({ item, originalIndex }, index) => (
                <div key={item.id} className="grid gap-2 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full border px-2 py-0.5 ${item.visible ? "border-emerald-500/60 text-emerald-300" : "border-zinc-500/60 text-zinc-300"}`}>{item.visible ? "Visible" : "Hidden"}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-muted">Order {item.order || index + 1}</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <Select label="Page" value={item.pageId || selectedPageId} options={managedPages.map((page) => page.id)} optionLabel={(value) => managedPages.find((page) => page.id === value)?.title || value} onChange={(value) => patchArray(setPageSections, originalIndex, { pageId: value, pageKey: managedPages.find((p) => p.id === value)?.pageKey || "" })} />
                    <Select
                      label="Section type"
                      value={item.sectionType || "Custom Info Block"}
                      options={["Hero", "Stats", "CTA", "Pricing Intro", "Pricing Grid", "Testimonial Block", "FAQ Block", "Resource Grid", "Lead Magnet", "Rich Text Block", "Feature Grid", "Custom Info Block"]}
                      onChange={(value) => patchArray(setPageSections, originalIndex, { sectionType: value })}
                    />
                    <Field label="Order" type="number" value={String(item.order || 0)} onChange={(value) => patchArray(setPageSections, originalIndex, { order: Number(value) || 0 })} />
                  </div>
                  <Field label="Title" value={item.title || ""} onChange={(value) => patchArray(setPageSections, originalIndex, { title: value })} />
                  <Area label="Subtitle" value={item.subtitle || ""} onChange={(value) => patchArray(setPageSections, originalIndex, { subtitle: value })} />
                  <Area label="Body" value={item.body || ""} onChange={(value) => patchArray(setPageSections, originalIndex, { body: value })} />
                  <div className="grid gap-2 md:grid-cols-2">
                    <Field label="CTA text" value={item.ctaText || ""} onChange={(value) => patchArray(setPageSections, originalIndex, { ctaText: value })} />
                    <Field label="CTA URL" value={item.ctaUrl || ""} onChange={(value) => patchArray(setPageSections, originalIndex, { ctaUrl: value })} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-sm"><input type="checkbox" checked={Boolean(item.visible)} onChange={(e) => patchArray(setPageSections, originalIndex, { visible: e.target.checked })} /> Visible</label>
                    <button
                      className="rounded border border-border px-2 py-1 text-sm"
                      disabled={index === 0}
                      onClick={() => {
                        const above = scopedSections[index - 1];
                        if (!above) return;
                        setPageSections((current) =>
                          current.map((entry, idx) => {
                            if (idx === originalIndex) return { ...entry, order: (above.item.order || index) };
                            if (idx === above.originalIndex) return { ...entry, order: (item.order || index + 1) };
                            return entry;
                          })
                        );
                      }}
                    >
                      Move up
                    </button>
                    <button
                      className="rounded border border-border px-2 py-1 text-sm"
                      disabled={index === scopedSections.length - 1}
                      onClick={() => {
                        const below = scopedSections[index + 1];
                        if (!below) return;
                        setPageSections((current) =>
                          current.map((entry, idx) => {
                            if (idx === originalIndex) return { ...entry, order: (below.item.order || index + 2) };
                            if (idx === below.originalIndex) return { ...entry, order: (item.order || index + 1) };
                            return entry;
                          })
                        );
                      }}
                    >
                      Move down
                    </button>
                    <button className="w-fit rounded border border-border px-2 py-1 text-sm" onClick={() => removeAt(setPageSections, originalIndex)}>Delete</button>
                  </div>
                </div>
              ))}
              <button
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black"
                onClick={async () => {
                  await fetch("/api/admin/page-sections", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload: pageSections }) });
                  setStatus("Page sections saved.");
                  await loadPageSections();
                  await loadOverview();
                }}
              >
                Save page sections
              </button>
            </div>
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
              <form onSubmit={createUser} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))} required minLength={4} />
                <input className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" placeholder="Display name" value={newUser.name} onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))} required />
                <input className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" placeholder="Password" type="password" minLength={8} value={newUser.password} onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))} required />
                <select className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value as "admin" | "user" }))}><option value="user">User</option><option value="admin">Admin</option></select>
                <button className="min-h-11 rounded-lg bg-brand px-4 py-2 font-semibold text-black md:col-span-2 xl:col-span-4">Create New</button>
              </form>
              <div className="mt-6 hidden overflow-hidden rounded-xl border border-border md:block">
                <table className="min-w-full text-sm"><thead className="bg-white/5"><tr><th className="p-3 text-left">Username</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Actions</th></tr></thead>
                  <tbody>{users.map((u) => <tr key={u.id} className="border-t border-border/70"><td className="p-3">{u.username}</td><td className="p-3">{u.name}</td><td className="p-3"><select value={u.role} className="min-h-9 rounded border border-border bg-background px-2 py-1" onChange={(e) => updateUserRole(u.id, e.target.value as "admin" | "user")}><option value="user">user</option><option value="admin">admin</option></select></td><td className="p-3"><button className="rounded border border-border px-2 py-1" onClick={() => deleteUser(u.id)}>Delete</button></td></tr>)}</tbody>
                </table>
              </div>
              <div className="mt-6 space-y-2 md:hidden">
                {users.map((u) => (
                  <div key={u.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{u.username}</p>
                    <p className="text-muted">{u.name}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <select value={u.role} className="min-h-10 flex-1 rounded border border-border bg-background px-2 py-1" onChange={(e) => updateUserRole(u.id, e.target.value as "admin" | "user")}><option value="user">user</option><option value="admin">admin</option></select>
                      <button className="min-h-10 rounded border border-border px-3 py-1.5" onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  </div>
                ))}
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
  return <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted">{label}</p><p className="text-xl font-semibold sm:text-2xl">{value}</p></div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><input type={type} className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><textarea className="min-h-28 rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Select({ label, value, options, onChange, optionLabel }: { label: string; value: string; options: string[]; onChange: (v: string) => void; optionLabel?: (v: string) => string }) {
  return <label className="grid gap-1 text-sm"><span className="text-muted">{label}</span><select className="min-h-11 rounded-lg border border-border bg-background px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option} value={option}>{optionLabel ? optionLabel(option) : option}</option>)}</select></label>;
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
        <div key={`${item.href}-${index}`} className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-2">
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


function LeadMagnetManager({
  settings,
  resources,
  metrics,
  onSaved
}: {
  settings: LeadMagnetSettings;
  resources: ResourceItem[];
  metrics: LeadMetrics | null;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState<LeadMagnetSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/lead-magnet", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);
    await onSaved();
  }

  function toggleResource(id: string) {
    const current = new Set(form.selectedResourceIds || []);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    setForm({ ...form, selectedResourceIds: Array.from(current) });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lead Magnet</h2>
      <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
        <Field label="Internal name" value={form.name || ""} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Slug" value={form.slug || ""} onChange={(value) => setForm({ ...form, slug: value })} />
        <Field label="Public heading" value={form.publicTitle || ""} onChange={(value) => setForm({ ...form, publicTitle: value })} />
        <Field label="CTA button label" value={form.buttonLabel || ""} onChange={(value) => setForm({ ...form, buttonLabel: value })} />
        <Area label="Public subheading" value={form.publicDescription || ""} onChange={(value) => setForm({ ...form, publicDescription: value })} />
        <Area label="Success message" value={form.successMessage || ""} onChange={(value) => setForm({ ...form, successMessage: value })} />
      </div>

      <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
        <Field label="Email subject" value={form.emailSubject || ""} onChange={(value) => setForm({ ...form, emailSubject: value })} />
        <Field label="Preview text" value={form.emailPreviewText || ""} onChange={(value) => setForm({ ...form, emailPreviewText: value })} />
        <Area label="Email intro" value={form.emailIntro || ""} onChange={(value) => setForm({ ...form, emailIntro: value })} />
        <Area label="Email closing" value={form.emailClosing || ""} onChange={(value) => setForm({ ...form, emailClosing: value })} />
      </div>

      <div className="grid gap-3 rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Attached resources</h3>
        {resources.map((resource) => (
          <label key={resource.id} className="flex items-center justify-between rounded border border-border p-2 text-sm">
            <span>{resource.title} <span className="text-muted">({resource.label})</span></span>
            <input type="checkbox" checked={(form.selectedResourceIds || []).includes(resource.id)} onChange={() => toggleResource(resource.id)} />
          </label>
        ))}
        <Select label="Primary resource" value={form.primaryResourceId || ""} options={["", ...(form.selectedResourceIds || [])]} optionLabel={(id) => id ? resources.find((r) => r.id === id)?.title || id : "None"} onChange={(value) => setForm({ ...form, primaryResourceId: value || undefined })} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label><input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
        <label><input type="checkbox" checked={Boolean(form.resendOnDuplicate)} onChange={(e) => setForm({ ...form, resendOnDuplicate: e.target.checked })} /> Resend on duplicate</label>
      </div>

      <div className="grid gap-2 rounded-xl border border-border p-4 text-sm md:grid-cols-4">
        <Kpi label="Total submissions" value={String(metrics?.totalSubmissions || 0)} />
        <Kpi label="Emails sent" value={String(metrics?.sent || 0)} />
        <Kpi label="Failed sends" value={String(metrics?.failed || 0)} />
        <Kpi label="Last submission" value={metrics?.lastSubmissionAt ? new Date(metrics.lastSubmissionAt).toLocaleDateString() : "--"} />
      </div>

      <button disabled={saving} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={save}>{saving ? "Saving..." : "Save Lead Magnet Settings"}</button>
    </div>
  );
}

function SubscriberManager({
  subscribers,
  onRefresh,
  setStatus
}: {
  subscribers: LeadSubscriber[];
  onRefresh: () => Promise<void>;
  setStatus: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = subscribers.filter((item) => item.email.toLowerCase().includes(query.toLowerCase()));

  async function resend(item: LeadSubscriber) {
    const res = await fetch("/api/admin/lead-subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriberId: item.id, email: item.email })
    });
    const data = await res.json().catch(() => ({}));
    setStatus(data.message || (res.ok ? "Email resent." : "Resend failed."));
    await onRefresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete subscriber record?")) return;
    await fetch("/api/admin/lead-subscribers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriberId: id }) });
    await onRefresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lead Subscribers</h2>
      <label className="grid gap-1 text-sm"><span className="text-muted">Search email</span><input className="rounded-lg border border-border bg-background px-3 py-2" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-medium">{item.email}</p>
              <p className="text-xs text-muted">{item.emailDeliveryStatus} · {new Date(item.subscribedAt).toLocaleString()}</p>
              {item.lastError ? <p className="text-xs text-red-400">{item.lastError}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => resend(item)}>Resend</button>
              <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailSettings({ status, onRefresh, setStatus }: { status: Record<string, unknown> | null; onRefresh: () => Promise<void>; setStatus: (value: string) => void }) {
  const [form, setForm] = useState({
    smtpHost: "mail.spacemail.com",
    smtpPort: "465",
    smtpSecure: true,
    smtpUser: "contact@elevareai.store",
    smtpPassword: "",
    clearPassword: false,
    senderEmail: "contact@elevareai.store",
    senderName: "ScopeGuard",
    replyToEmail: "",
    defaultTestRecipient: "contact@elevareai.store",
    isActive: true
  });
  const [recipient, setRecipient] = useState("contact@elevareai.store");
  const [loading, setLoading] = useState<"idle" | "save" | "connection" | "email">("idle");

  useEffect(() => {
    if (!status) return;
    setForm({
      smtpHost: String(status.smtpHost || "mail.spacemail.com"),
      smtpPort: String(status.smtpPort || 465),
      smtpSecure: Boolean(status.smtpSecure ?? true),
      smtpUser: String(status.smtpUser || "contact@elevareai.store"),
      smtpPassword: "",
      clearPassword: false,
      senderEmail: String(status.senderEmail || "contact@elevareai.store"),
      senderName: String(status.senderName || "ScopeGuard"),
      replyToEmail: String(status.replyToEmail || ""),
      defaultTestRecipient: String(status.defaultTestRecipient || "contact@elevareai.store"),
      isActive: Boolean(status.isActive ?? true)
    });
    setRecipient(String(status.defaultTestRecipient || "contact@elevareai.store"));
  }, [status]);

  async function saveSettings() {
    setLoading("save");
    const res = await fetch("/api/admin/email/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        smtpPort: Number(form.smtpPort)
      })
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    setStatus(data.message || (res.ok ? "SMTP settings saved successfully." : "Could not save SMTP settings."));
    setLoading("idle");
    await onRefresh();
  }

  async function testConnection() {
    setLoading("connection");
    const res = await fetch("/api/admin/email/connection", { method: "POST" });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    setStatus(data.message || (res.ok ? "Connection verified successfully." : "Unable to verify connection."));
    setLoading("idle");
    await onRefresh();
  }

  async function sendTest() {
    setLoading("email");
    const res = await fetch("/api/admin/email/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipient })
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    setStatus(data.message || (res.ok ? "Test email sent successfully." : "Unable to send test email."));
    setLoading("idle");
    await onRefresh();
  }

  function resetForm() {
    if (!status) return;
    setForm({
      smtpHost: String(status.smtpHost || "mail.spacemail.com"),
      smtpPort: String(status.smtpPort || 465),
      smtpSecure: Boolean(status.smtpSecure ?? true),
      smtpUser: String(status.smtpUser || "contact@elevareai.store"),
      smtpPassword: "",
      clearPassword: false,
      senderEmail: String(status.senderEmail || "contact@elevareai.store"),
      senderName: String(status.senderName || "ScopeGuard"),
      replyToEmail: String(status.replyToEmail || ""),
      defaultTestRecipient: String(status.defaultTestRecipient || "contact@elevareai.store"),
      isActive: Boolean(status.isActive ?? true)
    });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Email / SMTP</h2>

      <div className="grid gap-3 rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">SMTP Connection</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="SMTP host" value={form.smtpHost} onChange={(value) => setForm((s) => ({ ...s, smtpHost: value }))} />
          <Field label="SMTP port" type="number" value={form.smtpPort} onChange={(value) => setForm((s) => ({ ...s, smtpPort: value }))} />
          <Field label="SMTP username" value={form.smtpUser} onChange={(value) => setForm((s) => ({ ...s, smtpUser: value }))} />
          <label className="grid gap-1 text-sm"><span className="text-muted">SMTP password (leave blank to keep current)</span><input type="password" className="rounded-lg border border-border bg-background px-3 py-2" value={form.smtpPassword} onChange={(e) => setForm((s) => ({ ...s, smtpPassword: e.target.value }))} /></label>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label><input type="checkbox" checked={form.smtpSecure} onChange={(e) => setForm((s) => ({ ...s, smtpSecure: e.target.checked }))} /> Secure SSL</label>
          <label><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))} /> Email sending active</label>
          <label><input type="checkbox" checked={form.clearPassword} onChange={(e) => setForm((s) => ({ ...s, clearPassword: e.target.checked }))} /> Clear saved password</label>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Sender Identity</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Sender email" value={form.senderEmail} onChange={(value) => setForm((s) => ({ ...s, senderEmail: value }))} />
          <Field label="Sender name" value={form.senderName} onChange={(value) => setForm((s) => ({ ...s, senderName: value }))} />
          <Field label="Reply-to email (optional)" value={form.replyToEmail} onChange={(value) => setForm((s) => ({ ...s, replyToEmail: value }))} />
          <Field label="Default test recipient" value={form.defaultTestRecipient} onChange={(value) => setForm((s) => ({ ...s, defaultTestRecipient: value }))} />
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Test / Diagnostics</h3>
        <label className="grid gap-1 text-sm"><span className="text-muted">Test recipient</span><input className="rounded-lg border border-border bg-background px-3 py-2" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></label>
        <div className="flex flex-wrap items-center gap-2">
          <button disabled={loading !== "idle"} className="rounded-lg border border-border px-4 py-2 text-sm" onClick={testConnection}>{loading === "connection" ? "Testing..." : "Test Connection"}</button>
          <button disabled={loading !== "idle"} className="rounded-lg border border-border px-4 py-2 text-sm" onClick={sendTest}>{loading === "email" ? "Sending..." : "Send Test Email"}</button>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-border p-4 text-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Operational Status</h3>
        <p><strong>Active:</strong> {status?.isActive ? "Yes" : "No"}</p>
        <p><strong>Host:</strong> {String(status?.smtpHost || "mail.spacemail.com")}</p>
        <p><strong>Port:</strong> {String(status?.smtpPort || 465)}</p>
        <p><strong>Secure SSL:</strong> {status?.smtpSecure ? "Enabled" : "Disabled"}</p>
        <p><strong>Sender email:</strong> {String(status?.senderEmail || "contact@elevareai.store")}</p>
        <p><strong>Password configured:</strong> {status?.hasPassword ? "Yes" : "No"}</p>
        <p><strong>Last updated:</strong> {status?.updatedAt ? new Date(String(status.updatedAt)).toLocaleString() : "Not yet saved"}</p>
        <p><strong>Last connection test:</strong> {status?.lastConnectionTestStatus ? `${String(status.lastConnectionTestStatus)} (${new Date(String(status.lastConnectionTestAt)).toLocaleString()})` : "Not tested"}</p>
        <p><strong>Last test email:</strong> {status?.lastTestEmailStatus ? `${String(status.lastTestEmailStatus)} (${new Date(String(status.lastTestEmailAt)).toLocaleString()})` : "Not sent"}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button disabled={loading !== "idle"} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black" onClick={saveSettings}>{loading === "save" ? "Saving..." : "Save Settings"}</button>
        <button disabled={loading !== "idle"} className="rounded-lg border border-border px-4 py-2 text-sm" onClick={resetForm}>Reset</button>
      </div>
    </div>
  );
}
