import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getEmailSettingsForAdmin } from "@/lib/email-settings-store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getEmailSettingsForAdmin());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
