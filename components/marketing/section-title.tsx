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
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-muted">{description}</p> : null}
    </div>
  );
}
