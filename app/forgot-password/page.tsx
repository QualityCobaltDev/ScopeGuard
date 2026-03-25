import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset access" subtitle="For security, contact support to manually reset account access.">
      <p className="text-sm text-muted">Email contact@elevareai.store from your account email and include your full name.</p>
      <Link href="/signin" className="mt-4 inline-block rounded-lg border border-border px-4 py-2">Back to sign in</Link>
    </AuthShell>
  );
}
