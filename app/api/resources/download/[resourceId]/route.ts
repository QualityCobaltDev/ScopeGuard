import { NextResponse } from "next/server";
import { readCollection } from "@/lib/content-store";
import { readFiles } from "@/lib/file-store";
import { getCurrentUser } from "@/lib/user-store";

export async function GET(_: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const { resourceId } = await params;
  const [resources, files] = await Promise.all([readCollection("resources"), readFiles()]);
  const resource = resources.find((item) => item.id === resourceId && item.status === "published");
  if (!resource) return NextResponse.json({ message: "Resource not found." }, { status: 404 });

  const accessType = (resource as any).accessType || "public";
  if (accessType === "hidden") return NextResponse.json({ message: "Resource unavailable." }, { status: 404 });

  if (accessType === "account_required") {
    const user = await getCurrentUser();
    if (!user) {
      const next = encodeURIComponent(`/resources?download=${resourceId}`);
      return NextResponse.redirect(new URL(`/signin?next=${next}`, process.env.SITE_URL || "http://localhost:3000"));
    }
  }

  const file = resource.fileId ? files.find((item) => item.id === resource.fileId) : null;
  const href = resource.externalUrl || file?.publicUrl;
  if (!href) return NextResponse.json({ message: "Resource file is missing." }, { status: 400 });

  return NextResponse.redirect(new URL(href, process.env.SITE_URL || "http://localhost:3000"));
}
