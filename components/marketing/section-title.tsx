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
    <Reveal className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 md:mb-14" y={18} duration={0.6}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-soft sm:text-xs">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-4xl md:text-[2.95rem] md:leading-[1.08]">
        <span className="text-reveal">{title}</span>
      </h2>
      {description ? (
        <p className="text-reveal-soft mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{description}</p>
      ) : null}
    </Reveal>
  );
}
