import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getOverviewMetrics } from "@/lib/cms-store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getOverviewMetrics());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
