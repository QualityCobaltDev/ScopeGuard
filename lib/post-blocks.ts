import type { UploadedFileRecord } from "@/lib/file-store";

export const BLOG_BLOCK_TYPES = ["richText", "heading", "image", "video", "download", "cta", "quote", "list"] as const;
export type BlogBlockType = (typeof BLOG_BLOCK_TYPES)[number];

export type BlogPostBlock =
  | {
      id: string;
      type: "richText";
      text: string;
    }
  | {
      id: string;
      type: "heading";
      text: string;
      level: 2 | 3;
    }
  | {
      id: string;
      type: "image";
      url: string;
      alt: string;
      caption?: string;
    }
  | {
      id: string;
      type: "video";
      url: string;
      caption?: string;
    }
  | {
      id: string;
      type: "download";
      label: string;
      url: string;
      description?: string;
      fileId?: string;
    }
  | {
      id: string;
      type: "cta";
      text: string;
      buttonLabel: string;
      buttonUrl: string;
    }
  | {
      id: string;
      type: "quote";
      quote: string;
      attribution?: string;
    }
  | {
      id: string;
      type: "list";
      style: "ordered" | "unordered";
      items: string[];
    };

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function toOptionalString(value: unknown): string | undefined {
  const next = toStringValue(value).trim();
  return next || undefined;
}

function safeHttpUrl(input: string): string {
  const value = input.trim();
  if (!value) return "";
  if (value.startsWith("/")) return value;

  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    return "";
  } catch {
    return "";
  }
}

function normalizeListItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => toStringValue(entry).trim()).filter(Boolean);
}

function normalizeLevel(value: unknown): 2 | 3 {
  return value === 3 ? 3 : 2;
}

function blockId(value: unknown): string {
  const id = toStringValue(value).trim();
  return id || `block-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function normalizePostBlocks(value: unknown): BlogPostBlock[] {
  if (!Array.isArray(value)) return [];

  const blocks: BlogPostBlock[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const entry = raw as Record<string, unknown>;
    const type = toStringValue(entry.type) as BlogBlockType;
    if (!BLOG_BLOCK_TYPES.includes(type)) continue;

    if (type === "richText") {
      const text = toStringValue(entry.text).trim();
      if (!text) continue;
      blocks.push({ id: blockId(entry.id), type, text });
      continue;
    }

    if (type === "heading") {
      const text = toStringValue(entry.text).trim();
      if (!text) continue;
      blocks.push({ id: blockId(entry.id), type, text, level: normalizeLevel(entry.level) });
      continue;
    }

    if (type === "image") {
      const url = safeHttpUrl(toStringValue(entry.url));
      if (!url) continue;
      blocks.push({
        id: blockId(entry.id),
        type,
        url,
        alt: toStringValue(entry.alt).trim(),
        caption: toOptionalString(entry.caption)
      });
      continue;
    }

    if (type === "video") {
      const url = safeHttpUrl(toStringValue(entry.url));
      if (!url) continue;
      blocks.push({ id: blockId(entry.id), type, url, caption: toOptionalString(entry.caption) });
      continue;
    }

    if (type === "download") {
      const label = toStringValue(entry.label).trim();
      const url = safeHttpUrl(toStringValue(entry.url));
      if (!label || !url) continue;
      blocks.push({
        id: blockId(entry.id),
        type,
        label,
        url,
        description: toOptionalString(entry.description),
        fileId: toOptionalString(entry.fileId)
      });
      continue;
    }

    if (type === "cta") {
      const text = toStringValue(entry.text).trim();
      const buttonLabel = toStringValue(entry.buttonLabel).trim();
      const buttonUrl = safeHttpUrl(toStringValue(entry.buttonUrl));
      if (!text || !buttonLabel || !buttonUrl) continue;
      blocks.push({ id: blockId(entry.id), type, text, buttonLabel, buttonUrl });
      continue;
    }

    if (type === "quote") {
      const quote = toStringValue(entry.quote).trim();
      if (!quote) continue;
      blocks.push({ id: blockId(entry.id), type, quote, attribution: toOptionalString(entry.attribution) });
      continue;
    }

    if (type === "list") {
      const items = normalizeListItems(entry.items);
      if (!items.length) continue;
      blocks.push({ id: blockId(entry.id), type, style: entry.style === "ordered" ? "ordered" : "unordered", items });
    }
  }

  return blocks;
}

export function normalizeVideoEmbedUrl(url: string): string {
  const clean = safeHttpUrl(url);
  if (!clean) return "";

  try {
    const parsed = new URL(clean);
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const id = segments[segments.length - 1];
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {
    return "";
  }

  return clean;
}

export function resolveDownloadUrl(url: string, fileId: string | undefined, files: UploadedFileRecord[]): string {
  if (fileId) {
    const file = files.find((entry) => entry.id === fileId);
    if (file) return file.publicUrl;
  }
  return safeHttpUrl(url);
}

export function safePublicAssetUrl(url: string): string {
  return safeHttpUrl(url);
}
