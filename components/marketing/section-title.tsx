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
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 md:mb-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-soft sm:text-xs">{eyebrow}</p>
      <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-muted sm:mt-4 sm:text-base">{description}</p> : null}
    </div>
  );
}
