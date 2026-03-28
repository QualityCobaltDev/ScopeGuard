import { notFound } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/marketing/contact-form";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";
import { Reveal } from "@/components/ui/reveal";

const defaultContactMetadata = { title: "Contact", description: "Contact ScopeGuard for product and support inquiries.", path: "/contact" };

export async function generateMetadata() {
  const { page } = await readManagedPageContent("contact");
  return createMetadata({
    ...defaultContactMetadata,
    title: page?.seoTitle || defaultContactMetadata.title,
    description: page?.seoDescription || defaultContactMetadata.description
  });
}

export default async function ContactPage() {
  const [{ page, sections }, site] = await Promise.all([readManagedPageContent("contact"), readCollection("site")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
      <div className="container py-14 sm:py-18 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Contact</p>
              <h1 className="text-reveal mt-2 text-balance text-3xl font-semibold sm:text-4xl">{localizeText(site.contact.headline)}</h1>
              <p className="mt-4 text-sm leading-7 text-muted">{localizeText(site.contact.description)}</p>
              <div className="mt-7 space-y-2.5 text-sm text-muted">
                <p className="flex items-center gap-2 text-foreground"><Mail className="h-4 w-4" /> {site.contactEmail}</p>
                <p className="flex items-center gap-2 text-foreground"><ShieldCheck className="h-4 w-4" /> Response window: {localizeText(site.contact.responseWindow)}</p>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="p-6 sm:p-8">
              <ContactForm />
            </Card>
          </Reveal>
        </div>
      </div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
