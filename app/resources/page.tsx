import { ArrowUpRight, BookOpenText } from "lucide-react";
import { resources } from "@/content/resources";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Resources",
  description: "Future-ready resource hub for freelancer legal and business growth content.",
  path: "/resources"
});

export default function ResourcesPage() {
  return (
    <div className="container py-20">
      <SectionTitle
        eyebrow="Resources"
        title="Build your freelancer advantage library"
        description="This page is structured for future blog posts, lead magnets, and downloadable implementation tools."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {resources.map((item) => (
          <Card key={item.title} className="p-6">
            <BookOpenText className="h-5 w-5 text-brand-soft" />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.type}</p>
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            <p className="mt-5 inline-flex items-center gap-1 text-sm text-foreground">
              {item.status} <ArrowUpRight className="h-4 w-4" />
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
