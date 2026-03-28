import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { readPages, readPageSections } from "@/lib/cms-store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = await readPages();
  const page = pages.find((item) => item.slug === slug && item.isPublished && item.isVisible);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    openGraph: {
      title: page.ogTitle || page.seoTitle || page.title,
      description: page.ogDescription || page.seoDescription || undefined
    }
  };
}

export default async function ManagedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pages, sections] = await Promise.all([readPages(), readPageSections()]);
  const page = pages.find((item) => item.slug === slug && item.isPublished && item.isVisible);
  if (!page) notFound();

  const pageSections = sections.filter((item) => item.pageId === page.id && item.visible).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <h1 className="text-balance text-2xl font-semibold sm:text-3xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted">/{page.slug}</p>
      <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        {pageSections.map((section) => (
          <Card key={section.id} className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">{section.sectionType}</p>
            <h2 className="mt-2 text-balance text-xl font-semibold sm:text-2xl">{section.title}</h2>
            {section.subtitle ? <p className="mt-2 text-sm leading-7 text-muted">{section.subtitle}</p> : null}
            {section.body ? <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p> : null}
            {section.ctaText && section.ctaUrl ? <a className="mt-4 inline-flex min-h-10 items-center text-sm underline" href={section.ctaUrl}>{section.ctaText}</a> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
