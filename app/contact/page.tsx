import { Mail, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { contactEmail } from "@/lib/checkout";
import { createMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact ScopeGuard for product, support, and business inquiries.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold">Talk to ScopeGuard</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Ask product questions, partnership requests, or support inquiries. We reply with clear, practical guidance.
          </p>
          <div className="mt-8 space-y-3 text-sm text-muted">
            <p className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4" /> {contactEmail}
            </p>
            <p className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4" /> Response window: 1–2 business days
            </p>
          </div>
        </Card>

        <Card className="p-7">
          <ContactForm />
        </Card>
      </div>
    </div>
  );
}
