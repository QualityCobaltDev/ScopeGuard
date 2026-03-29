import { Card } from "@/components/ui/card";
import { renderSafeInlineMarkdown } from "@/lib/blog";
import { BlogPostBlock, normalizeVideoEmbedUrl, safePublicAssetUrl } from "@/lib/post-blocks";

export function BlogBlockRenderer({ block }: { block: BlogPostBlock }) {
  if (block.type === "richText") {
    return <p className="text-base leading-8 text-muted" dangerouslySetInnerHTML={{ __html: renderSafeInlineMarkdown(block.text) }} />;
  }

  if (block.type === "heading") {
    if (block.level === 3) return <h3 className="text-2xl font-semibold text-foreground">{block.text}</h3>;
    return <h2 className="text-3xl font-semibold text-foreground">{block.text}</h2>;
  }

  if (block.type === "image") {
    const source = safePublicAssetUrl(block.url);
    if (!source) return null;
    return (
      <figure className="space-y-3">
        <img src={source} alt={block.alt || "Blog image"} className="w-full rounded-2xl border border-border/70 object-cover" loading="lazy" />
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "video") {
    const embed = normalizeVideoEmbedUrl(block.url);
    if (!embed) return null;
    return (
      <figure className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={embed}
              className="absolute inset-0 h-full w-full"
              title="Embedded video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "download") {
    return (
      <Card className="border-brand/35 bg-brand/5 p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-brand-soft">Download</p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{block.label}</h3>
        {block.description ? <p className="mt-2 text-sm text-muted">{block.description}</p> : null}
        <a className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-brand/50 px-4 text-sm font-medium text-foreground hover:bg-brand/15" href={block.url} target="_blank" rel="noreferrer">
          Get file
        </a>
      </Card>
    );
  }

  if (block.type === "cta") {
    return (
      <Card className="border-brand/35 bg-white/[0.02] p-6">
        <p className="text-lg font-semibold text-foreground">{block.text}</p>
        <a className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-black" href={block.buttonUrl}>
          {block.buttonLabel}
        </a>
      </Card>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="rounded-xl border-l-4 border-brand-soft/70 bg-white/[0.02] px-5 py-4">
        <p className="text-lg italic leading-8 text-foreground">“{block.quote}”</p>
        {block.attribution ? <footer className="mt-2 text-sm text-muted">— {block.attribution}</footer> : null}
      </blockquote>
    );
  }

  if (block.type === "list") {
    if (block.style === "ordered") {
      return <ol className="list-decimal space-y-2 pl-5 text-base leading-8 text-muted">{block.items.map((item, index) => <li key={`${block.id}-${index}`}>{item}</li>)}</ol>;
    }
    return <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-muted">{block.items.map((item, index) => <li key={`${block.id}-${index}`}>{item}</li>)}</ul>;
  }

  return null;
}
