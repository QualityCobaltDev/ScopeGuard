import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms",
  description: "ScopeGuard terms and conditions.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <div className="container py-20">
      <article className="prose-legal mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-foreground">Terms of Service</h1>
        <p>Last updated: March 25, 2026.</p>
        <h2>License</h2>
        <p>Purchases grant a non-transferable license for use in your own freelance business. Redistribution or resale is prohibited.</p>
        <h2>Disclaimer</h2>
        <p>ScopeGuard provides business and documentation resources, not individualized legal advice. Consult qualified counsel when required.</p>
        <h2>Limitation of liability</h2>
        <p>ScopeGuard is not liable for indirect or consequential damages arising from use of the products.</p>
        <h2>Governing terms</h2>
        <p>Terms may be updated periodically. Continued use indicates acceptance of revisions.</p>
      </article>
    </div>
  );
}
