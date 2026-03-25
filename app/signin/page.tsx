import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <AuthShell title="Sign in" subtitle="Access your Elevare AI account.">
      <SignInForm />
      <p className="mt-4 text-sm text-muted">No account? <Link className="text-foreground underline" href="/signup">Create one</Link></p>
    </AuthShell>
  );
}
