import { Reveal } from "@/components/ui/reveal";

export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-10 md:mb-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-soft sm:text-xs">{eyebrow}</p>
      <h2 className="text-reveal mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? <p className="text-reveal-soft mt-3 text-sm leading-7 text-muted sm:mt-4 sm:text-base sm:leading-8">{description}</p> : null}
    </Reveal>
  );
}
