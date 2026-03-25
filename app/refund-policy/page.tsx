import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Refund Policy",
  description: "ScopeGuard digital product refund policy.",
  path: "/refund-policy"
});

export default function RefundPolicyPage() {
  return (
    <div className="container py-20">
      <article className="prose-legal mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-foreground">Refund Policy</h1>
        <p>Last updated: March 25, 2026.</p>
        <h2>Digital goods policy</h2>
        <p>Due to instant access and downloadable delivery, all sales are generally final once files are accessed.</p>
        <h2>Exception handling</h2>
        <p>If files are corrupted or inaccessible, contact support within 7 days of purchase for a replacement or appropriate resolution.</p>
        <h2>Contact</h2>
        <p>Email support@scopeguard.co with order details for support requests.</p>
      </article>
    </div>
  );
}
