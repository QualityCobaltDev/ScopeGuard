import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: "Why ScopeGuard exists and how it helps freelancers protect revenue with authority-grade systems.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <div className="container py-20">
      <SectionTitle
        eyebrow="About ScopeGuard"
        title="Built for freelancers who treat protection as strategy"
        description="ScopeGuard was created to solve the operational weak points that quietly drain freelance businesses."
      />

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Card className="p-7">
          <h2 className="text-xl font-semibold">Why we exist</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Too many independent professionals lose income because their client process is improvised. ScopeGuard turns legal and
            operational best practices into a practical, implementable system.
          </p>
        </Card>
        <Card className="p-7">
          <h2 className="text-xl font-semibold">What we solve</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            We address late payments, scope creep, weak negotiation posture, and inconsistent onboarding through structured templates
            and scripts engineered for real client engagements.
          </p>
        </Card>
        <Card className="p-7">
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Help freelancers protect revenue, reduce admin drag, and operate with the professionalism of a high-performing agency.
          </p>
        </Card>
        <Card className="p-7">
          <h2 className="text-xl font-semibold">Professional standard</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            ScopeGuard is deliberately direct, premium, and practical. No fluff, no legal theater—just tools that improve business
            outcomes.
          </p>
        </Card>
      </div>
    </div>
  );
}
