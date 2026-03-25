import { Camera, CheckCircle2, Layers, ShieldAlert, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { pricingTiers } from "@/content/pricing";
import { deliverables } from "@/content/products";
import { checkoutLinks } from "@/lib/checkout";
import { LinkButton } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Product",
  description: "Explore ScopeGuard deliverables, tier benefits, and freelancer protection features.",
  path: "/product"
});

export default function ProductPage() {
  return (
    <div className="container py-20">
      <SectionTitle
        eyebrow="Product Overview"
        title="The complete freelancer protection and revenue framework"
        description="Every asset is designed to tighten boundaries, improve payment reliability, and elevate your client experience."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {[
          [ShieldAlert, "Risk Control", "Mitigate unpaid invoices, ambiguous scope, and legal misunderstandings."],
          [Layers, "System Depth", "From legal clauses to pricing mechanics and communication scripts."],
          [Target, "Conversion Focus", "Increase close rates and upsells with stronger proposals and negotiation language."]
        ].map(([Icon, title, description]) => (
          <Card key={title as string} className="p-6">
            <Icon className="h-5 w-5 text-brand-soft" />
            <h3 className="mt-3 text-lg font-semibold">{title as string}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{description as string}</p>
          </Card>
        ))}
      </div>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-8">
          <h3 className="text-xl font-semibold">What's included</h3>
          <ul className="mt-5 space-y-3">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-8">
          <h3 className="text-xl font-semibold">Who this is for</h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            Ideal for freelancers, consultants, and boutique studios who sell project or retainer work and need stronger client control.
          </p>
          <h4 className="mt-6 font-medium text-foreground">Bonus items</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Kickoff call structure template</li>
            <li>• Revision policy language bank</li>
            <li>• Profit-protection implementation checklist</li>
          </ul>
        </Card>
      </section>

      <section className="mt-16">
        <h3 className="text-center text-2xl font-semibold">Tier comparison</h3>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-foreground">
              <tr>
                <th className="p-4">Tier</th>
                <th className="p-4">Primary outcome</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((tier) => (
                <tr key={tier.id} className="border-t border-border/70">
                  <td className="p-4 font-medium text-foreground">{tier.name}</td>
                  <td className="p-4 text-muted">{tier.description}</td>
                  <td className="p-4 text-foreground">{tier.price}</td>
                  <td className="p-4">
                    <LinkButton href={checkoutLinks[tier.id]} size="sm" variant="secondary">
                      {tier.cta}
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-brand-soft" />
            <h3 className="text-xl font-semibold">Product previews / placeholders</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {["Contract Pack Preview", "Pricing Calculator Preview", "Script Library Preview"].map((label) => (
              <div key={label} className="aspect-video rounded-xl border border-dashed border-border bg-white/[0.03] p-4 text-xs text-muted">
                {label}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
