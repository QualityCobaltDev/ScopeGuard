import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";
import { CollectionName, ContentMap } from "@/lib/content-types";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const FILE_MAP: Record<CollectionName, string> = {
  site: "site.json",
  pricing: "pricing.json",
  testimonials: "testimonials.json",
  faq: "faq.json",
  products: "products.json",
  resources: "resources.json"
};

const ARRAY_COLLECTIONS: CollectionName[] = ["pricing", "testimonials", "faq", "resources"];

const forceContactEmail = <T>(payload: T): T => {
  if (typeof payload !== "object" || payload === null) return payload;
  const copy = structuredClone(payload) as Record<string, unknown>;
  if ("contactEmail" in copy) copy.contactEmail = "contact@elevareai.store";
  if ("email" in copy) copy.email = "contact@elevareai.store";
  if ("contact" in copy && typeof copy.contact === "object" && copy.contact) {
    (copy.contact as Record<string, unknown>).email = "contact@elevareai.store";
  }
  return copy as T;
};

export async function readCollection<K extends CollectionName>(collection: K): Promise<ContentMap[K]> {
  noStore();
  const filePath = path.join(STORAGE_DIR, FILE_MAP[collection]);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as ContentMap[K];
}

export async function writeCollection<K extends CollectionName>(collection: K, payload: ContentMap[K]): Promise<ContentMap[K]> {
  const filePath = path.join(STORAGE_DIR, FILE_MAP[collection]);
  const normalized = forceContactEmail(payload);
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized as ContentMap[K];
}

export async function createArrayItem<K extends CollectionName>(collection: K, payload: Record<string, unknown>) {
  if (!ARRAY_COLLECTIONS.includes(collection)) throw new Error("Collection does not support create operation.");
  const current = (await readCollection(collection)) as Record<string, unknown>[];
  const created = { id: payload.id || randomUUID(), ...payload };
  const next = [...current, created];
  await writeCollection(collection, next as ContentMap[K]);
  return created;
}

export async function updateArrayItem<K extends CollectionName>(collection: K, id: string, payload: Record<string, unknown>) {
  if (!ARRAY_COLLECTIONS.includes(collection)) throw new Error("Collection does not support update operation.");
  const current = (await readCollection(collection)) as Record<string, unknown>[];
  const next = current.map((item) => (String(item.id) === id ? { ...item, ...payload, id } : item));
  await writeCollection(collection, next as ContentMap[K]);
  return next.find((item) => String(item.id) === id);
}

export async function deleteArrayItem<K extends CollectionName>(collection: K, id: string) {
  if (!ARRAY_COLLECTIONS.includes(collection)) throw new Error("Collection does not support delete operation.");
  const current = (await readCollection(collection)) as Record<string, unknown>[];
  const next = current.filter((item) => String(item.id) !== id);
  await writeCollection(collection, next as ContentMap[K]);
  return { ok: true };
}
