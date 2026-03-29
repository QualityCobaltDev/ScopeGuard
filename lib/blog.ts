import { BlogPostBlock } from "@/lib/post-blocks";
import { ContentPost } from "@/lib/cms-store";

export const BLOG_PAGE_SIZE = 9;

export function slugifyPost(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function isPublishedPost(post: ContentPost): boolean {
  return post.status === "published";
}

export function resolvePostDate(post: ContentPost): string {
  return post.publishDate || post.publishedAt || post.updatedAt;
}

export function estimateReadingMinutes(post: ContentPost): number {
  const blockText = (post.blocks || [])
    .map((block) => {
      if (block.type === "richText" || block.type === "heading") return block.text;
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "quote") return block.quote;
      if (block.type === "cta") return `${block.text} ${block.buttonLabel}`;
      if (block.type === "download") return `${block.label} ${block.description || ""}`;
      return "";
    })
    .join(" ");

  const text = `${post.title} ${post.excerpt} ${post.body} ${blockText}`.trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderSafeInlineMarkdown(input: string): string {
  const escaped = escapeHtml(input.trim());
  const linked = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-brand-soft hover:text-foreground underline underline-offset-4">$1</a>');
  const bold = linked.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const italic = bold.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return italic.replace(/\n/g, "<br />");
}

export function sanitizePostInput(post: Partial<ContentPost>): Partial<ContentPost> {
  return {
    ...post,
    title: String(post.title || "").trim(),
    author: String(post.author || "ScopeGuard Team").trim(),
    excerpt: String(post.excerpt || "").trim(),
    body: String(post.body || "").trim(),
    slug: slugifyPost(String(post.slug || post.title || "")),
    status: post.status === "published" ? "published" : "draft",
    featuredImageUrl: post.featuredImageUrl ? String(post.featuredImageUrl).trim() : undefined,
    seoTitle: post.seoTitle ? String(post.seoTitle).trim() : undefined,
    seoDescription: post.seoDescription ? String(post.seoDescription).trim() : undefined,
    blocks: Array.isArray(post.blocks) ? (post.blocks as BlogPostBlock[]) : []
  };
}
