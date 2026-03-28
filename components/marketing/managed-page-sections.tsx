import { Card } from "@/components/ui/card";
import { localizeText } from "@/lib/localized";
import type { PageSectionBlock } from "@/lib/cms-store";

export function ManagedPageSections({ sections }: { sections: PageSectionBlock[] }) {
  if (!sections.length) return null;

  return (
    <section className="container py-6 sm:py-8 md:py-10">
      <div className="space-y-3 sm:space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="p-5 sm:p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">{section.sectionType}</p>
            <h2 className="mt-2 text-balance text-xl font-semibold sm:text-2xl">{localizeText(section.title, undefined, section.title)}</h2>
            {section.subtitle ? <p className="mt-2 text-sm leading-7 text-muted">{localizeText(section.subtitle, undefined, section.subtitle)}</p> : null}
            {section.body ? <p className="mt-3 text-sm leading-7 text-muted">{localizeText(section.body, undefined, section.body)}</p> : null}
            {section.ctaText && section.ctaUrl ? (
              <a className="mt-4 inline-flex min-h-10 items-center text-sm underline" href={section.ctaUrl}>
                {localizeText(section.ctaText, undefined, section.ctaText)}
              </a>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
