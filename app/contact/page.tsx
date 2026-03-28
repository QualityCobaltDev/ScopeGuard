import { Mail, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/marketing/contact-form";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({ title: "Contact", description: "Contact ScopeGuard for product and support inquiries.", path: "/contact" });

export default async function ContactPage() {
  const site = await readCollection("site");
  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2">
        <Card className="p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Contact</p>
          <h1 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">{site.contact.headline}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">{site.contact.description}</p>
          <div className="mt-7 space-y-2.5 text-sm text-muted">
            <p className="flex items-center gap-2 text-foreground"><Mail className="h-4 w-4" /> {site.contactEmail}</p>
            <p className="flex items-center gap-2 text-foreground"><ShieldCheck className="h-4 w-4" /> Response window: {site.contact.responseWindow}</p>
          </div>
        </Card>
        <Card className="p-5 sm:p-7">
          <ContactForm />
        </Card>
      </div>
    </div>
  );
}
