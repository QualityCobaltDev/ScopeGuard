import { NextResponse } from "next/server";
import { maskedEmailStatus } from "@/lib/email";
import { requireAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(maskedEmailStatus());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
