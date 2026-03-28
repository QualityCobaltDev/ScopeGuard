import { promises as fs } from "node:fs";
import path from "node:path";

type EventType = "page_view" | "lead_opt_in" | "resource_download" | "cta_click";

export type AnalyticsEvent = {
  id: string;
  type: EventType;
  key: string;
  at: string;
};

const FILE = path.join(process.cwd(), "storage", "analytics.json");

async function readEvents() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf-8")) as AnalyticsEvent[];
  } catch {
    return [];
  }
}

async function writeEvents(events: AnalyticsEvent[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(events.slice(0, 5000), null, 2)}\n`, "utf-8");
}

export async function trackEvent(type: EventType, key: string) {
  const events = await readEvents();
  events.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type, key, at: new Date().toISOString() });
  await writeEvents(events);
}

export async function getAnalyticsSummary() {
  const events = await readEvents();
  const now = Date.now();
  const last30 = events.filter((e) => now - new Date(e.at).getTime() <= 30 * 86400000);
  return {
    pageViews: last30.filter((e) => e.type === "page_view").length,
    leadOptIns: last30.filter((e) => e.type === "lead_opt_in").length,
    resourceDownloads: last30.filter((e) => e.type === "resource_download").length,
    ctaClicks: last30.filter((e) => e.type === "cta_click").length,
    recent: last30.slice(0, 20)
  };
}
