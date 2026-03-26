import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <AuthShell title="Create account" subtitle="Set up your secure dashboard access.">
      <SignUpForm />
      <p className="mt-4 text-sm text-muted">Already have an account? <Link className="text-foreground underline" href="/admin/signin">Admin Sign-in</Link></p>
    </AuthShell>
  );
}
