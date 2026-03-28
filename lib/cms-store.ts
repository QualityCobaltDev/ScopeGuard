import { promises as fs } from "node:fs";
import path from "node:path";
import { readCollection, writeCollection } from "@/lib/content-store";
import { readFiles } from "@/lib/file-store";
import { getEmailSettingsForAdmin } from "@/lib/email-settings-store";
import { getLeadMagnetSettings, getSubscribers, leadMagnetMetrics } from "@/lib/lead-magnet-store";
import { listUsers } from "@/lib/user-store";
import { SYSTEM_MANAGED_PAGES } from "@/lib/managed-pages";
import { BlogPostBlock, normalizePostBlocks, safePublicAssetUrl } from "@/lib/post-blocks";

export type ManagedPage = {
  id: string;
  title: string;
  internalName: string;
  slug: string;
  pageKey: string;
  pageType: "standard" | "landing" | "resource" | "legal" | "post";
  seoTitle: string;
  seoDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  isPublished: boolean;
  isVisible: boolean;
  showInNavigation: boolean;
  isSystemPage: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ContentPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  blocks?: BlogPostBlock[];
  featuredImageUrl?: string;
  publishDate?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageSectionBlock = {
  id: string;
  pageId: string;
  pageKey: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  visible: boolean;
  updatedAt: string;
};

const POSTS_PATH = path.join(process.cwd(), "storage", "posts.json");
const SECTIONS_PATH = path.join(process.cwd(), "storage", "page-sections.json");
const PAGES_PATH = path.join(process.cwd(), "storage", "pages.json");

async function readJson<T>(file: string, fallback: T) {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function withSystemPages(pages: ManagedPage[]): { pages: ManagedPage[]; changed: boolean } {
  let changed = false;
  const now = new Date().toISOString();
  const byId = new Map(pages.map((page) => [page.id, page]));
  const merged = [...pages];

  for (const definition of SYSTEM_MANAGED_PAGES) {
    const existing = byId.get(definition.id) || pages.find((page) => page.pageKey === definition.pageKey || page.slug === definition.slug);
    if (existing) {
      if (!existing.isSystemPage) {
        existing.isSystemPage = true;
        changed = true;
      }
      if (!existing.pageKey) {
        existing.pageKey = definition.pageKey;
        changed = true;
      }
      if (existing.slug !== definition.slug && existing.id === definition.id) {
        existing.slug = definition.slug;
        changed = true;
      }
      continue;
    }

    merged.push({
      id: definition.id,
      title: definition.title,
      internalName: definition.internalName,
      slug: definition.slug,
      pageKey: definition.pageKey,
      pageType: definition.pageType,
      seoTitle: definition.seoTitle,
      seoDescription: definition.seoDescription,
      isPublished: true,
      isVisible: true,
      showInNavigation: definition.showInNavigation,
      isSystemPage: true,
      sortOrder: definition.sortOrder,
      createdAt: now,
      updatedAt: now
    });
    changed = true;
  }

  return {
    pages: merged
      .map((page, index) => ({
        ...page,
        slug: String(page.slug || "").replace(/^\/+/, ""),
        pageKey: page.pageKey || page.slug || `page-${index + 1}`
      }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    changed
  };
}

function normalizePost(raw: Partial<ContentPost>): ContentPost {
  const now = new Date().toISOString();
  return {
    id: String(raw.id || ""),
    slug: String(raw.slug || "").trim(),
    title: String(raw.title || "").trim(),
    excerpt: String(raw.excerpt || "").trim(),
    body: String(raw.body || "").trim(),
    blocks: normalizePostBlocks(raw.blocks),
    featuredImageUrl: raw.featuredImageUrl ? safePublicAssetUrl(raw.featuredImageUrl) || undefined : undefined,
    publishDate: raw.publishDate || undefined,
    isPublished: Boolean(raw.isPublished),
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || now
  };
}

export async function readPages() {
  const storedPages = await readJson<ManagedPage[]>(PAGES_PATH, []);
  const { pages, changed } = withSystemPages(storedPages);
  if (changed) await writeJson(PAGES_PATH, pages);
  return pages;
}

export async function writePages(pages: ManagedPage[]) {
  await writeJson(PAGES_PATH, pages);
}

export async function readPosts() {
  const raw = await readJson<ContentPost[]>(POSTS_PATH, []);
  return raw.map((post) => normalizePost(post));
}

export async function writePosts(posts: ContentPost[]) {
  await writeJson(POSTS_PATH, posts.map((post) => normalizePost(post)));
}

export async function readPageSections() {
  return readJson<PageSectionBlock[]>(SECTIONS_PATH, []);
}

export async function writePageSections(sections: PageSectionBlock[]) {
  await writeJson(SECTIONS_PATH, sections);
}

export async function deletePageById(pageId: string) {
  const pages = await readPages();
  const target = pages.find((item) => item.id === pageId);
  if (!target) return false;
  if (target.isSystemPage) throw new Error("System pages cannot be deleted.");

  await writePages(pages.filter((item) => item.id !== pageId));
  const sections = await readPageSections();
  await writePageSections(sections.filter((item) => item.pageId !== pageId));
  return true;
}

export async function syncNavigationFromPages() {
  const [site, pages] = await Promise.all([readCollection("site"), readPages()]);
  const staticLinks = site.nav.filter((item) => pages.every((page) => `/${page.slug}` !== item.href));
  const managedLinks = pages
    .filter((page) => page.showInNavigation && page.isVisible && page.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((page) => ({ href: `/${page.slug}`, label: page.title }));

  await writeCollection("site", { ...site, nav: [...staticLinks, ...managedLinks] });
}

export async function getOverviewMetrics() {
  const [users, resources, pricing, faq, testimonials, files, smtp, leadMagnet, subscriberMetrics, sections, pages] = await Promise.all([
    listUsers(),
    readCollection("resources"),
    readCollection("pricing"),
    readCollection("faq"),
    readCollection("testimonials"),
    readFiles(),
    getEmailSettingsForAdmin(),
    getLeadMagnetSettings(),
    leadMagnetMetrics(),
    readPageSections(),
    readPages()
  ]);

  return {
    users: users.length,
    resourcesTotal: resources.length,
    resourcesPublished: resources.filter((r) => r.status === "published").length,
    resourcesHidden: resources.filter((r) => r.visibility !== "public").length,
    files: files.length,
    smtpActive: Boolean(smtp.isActive && smtp.hasPassword),
    smtpLastTest: smtp.lastConnectionTestAt || null,
    leadMagnetActive: leadMagnet.isActive,
    subscribers: subscriberMetrics.totalSubmissions,
    subscriberSent: subscriberMetrics.sent,
    pricingVisible: pricing.filter((p) => p.visible !== false).length,
    faqVisible: faq.filter((f) => f.visible !== false).length,
    testimonialsVisible: testimonials.filter((t) => t.visible !== false).length,
    sectionsTotal: sections.length,
    sectionsVisible: sections.filter((s) => s.visible).length,
    pagesTotal: pages.length,
    pagesPublished: pages.filter((p) => p.isPublished).length,
    pagesHidden: pages.filter((p) => !p.isVisible).length,
    navItems: (await readCollection("site")).nav.length,
    footerLinks: (await readCollection("site")).footer.companyLinks.length + (await readCollection("site")).footer.legalLinks.length
  };
}

export async function getSubscriberRows() {
  return getSubscribers();
}
