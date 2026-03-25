import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "ScopeGuard privacy policy.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <div className="container py-20">
      <article className="prose-legal mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1>
        <p>Last updated: March 25, 2026.</p>
        <h2>Information we collect</h2>
        <p>We collect contact details you submit, transactional information, and anonymous analytics data used to improve performance.</p>
        <h2>How we use data</h2>
        <p>We use collected data to deliver products, provide support, send relevant updates, and maintain platform security.</p>
        <h2>Data protection</h2>
        <p>We use practical administrative and technical safeguards. You are responsible for securing your own devices and accounts.</p>
        <h2>Contact</h2>
        <p>For privacy requests, email support@scopeguard.co.</p>
      </article>
    </div>
  );
}
