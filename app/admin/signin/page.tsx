import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

export default function AdminSignInPage() {
  return (
    <AuthShell title="Admin Sign-in" subtitle="Securely access the ScopeGuard Admin User Board.">
      <SignInForm />
      <p className="mt-4 text-sm text-muted">Need a user account? <Link className="text-foreground underline" href="/signup">Create one</Link></p>
    </AuthShell>
  );
}
