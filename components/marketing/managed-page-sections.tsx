import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { localizeText } from "@/lib/localized";
import type { PageSectionBlock } from "@/lib/cms-store";

export function ManagedPageSections({ sections }: { sections: PageSectionBlock[] }) {
  if (!sections.length) return null;

  return (
    <section className="container py-6 sm:py-8 md:py-10">
      <div className="space-y-3 sm:space-y-4">
        {sections.map((section, idx) => (
          <Reveal key={section.id} delay={idx * 0.05}>
            <Card className="p-5 sm:p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">{section.sectionType}</p>
              <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">{localizeText(section.title, undefined, section.title)}</h2>
              {section.subtitle ? <p className="mt-2 text-sm leading-7 text-muted">{localizeText(section.subtitle, undefined, section.subtitle)}</p> : null}
              {section.body ? <p className="mt-3 text-sm leading-7 text-muted">{localizeText(section.body, undefined, section.body)}</p> : null}
              {section.ctaText && section.ctaUrl ? (
                <a className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:text-brand-soft" href={section.ctaUrl}>
                  {localizeText(section.ctaText, undefined, section.ctaText)}
                </a>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
