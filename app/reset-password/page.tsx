import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Password reset" subtitle="Self-serve reset links are not enabled in this build.">
      <p className="text-sm text-muted">Please use the secure support process at contact@elevareai.store.</p>
      <Link href="/signin" className="mt-4 inline-block rounded-lg border border-border px-4 py-2">Back to sign in</Link>
    </AuthShell>
  );
}
