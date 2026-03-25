import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-3xl font-semibold">Unauthorized</h1>
      <p className="mt-3 text-muted">You do not have permission to access this page.</p>
      <Link href="/signin" className="mt-6 inline-block rounded-lg border border-border px-4 py-2">Back to sign in</Link>
    </div>
  );
}
