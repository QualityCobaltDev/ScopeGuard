import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getAnalyticsSummary } from "@/lib/analytics-store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getAnalyticsSummary());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
