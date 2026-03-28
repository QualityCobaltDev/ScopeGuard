import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { revalidateSiteContent } from "@/lib/site-sync";

export async function POST() {
  try {
    await requireAdmin();
    const result = await revalidateSiteContent();
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
