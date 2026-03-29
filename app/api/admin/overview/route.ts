import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getOverviewMetrics } from "@/lib/cms-store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getOverviewMetrics());
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/admin/overview] Failed to build admin overview.", error);
    return NextResponse.json({ message: "Unable to load overview metrics" }, { status: 500 });
  }
}
