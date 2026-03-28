import { promises as fs } from "node:fs";
import path from "node:path";
import { readCollection } from "@/lib/content-store";
import { readFiles } from "@/lib/file-store";
import { getEmailSettingsForAdmin } from "@/lib/email-settings-store";
import { getLeadMagnetSettings, getSubscribers, leadMagnetMetrics } from "@/lib/lead-magnet-store";
import { listUsers } from "@/lib/user-store";

export type ContentPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageSectionBlock = {
  id: string;
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

export async function readPosts() {
  return readJson<ContentPost[]>(POSTS_PATH, []);
}

export async function writePosts(posts: ContentPost[]) {
  await writeJson(POSTS_PATH, posts);
}

export async function readPageSections() {
  return readJson<PageSectionBlock[]>(SECTIONS_PATH, []);
}

export async function writePageSections(sections: PageSectionBlock[]) {
  await writeJson(SECTIONS_PATH, sections);
}

export async function getOverviewMetrics() {
  const [users, resources, pricing, faq, testimonials, files, smtp, leadMagnet, subscriberMetrics, sections] = await Promise.all([
    listUsers(),
    readCollection("resources"),
    readCollection("pricing"),
    readCollection("faq"),
    readCollection("testimonials"),
    readFiles(),
    getEmailSettingsForAdmin(),
    getLeadMagnetSettings(),
    leadMagnetMetrics(),
    readPageSections()
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
    navItems: (await readCollection("site")).nav.length,
    footerLinks: (await readCollection("site")).footer.companyLinks.length + (await readCollection("site")).footer.legalLinks.length
  };
}

export async function getSubscriberRows() {
  return getSubscribers();
}
