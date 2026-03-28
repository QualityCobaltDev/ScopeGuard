import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { deleteSubscriber, getSubscribers, markSubscriberFailure, sendLeadMagnetEmail } from "@/lib/lead-magnet-store";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ subscribers: await getSubscribers() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { subscriberId?: string; email?: string };
  if (!body.subscriberId || !body.email) {
    return NextResponse.json({ message: "subscriberId and email are required" }, { status: 400 });
  }

  try {
    await sendLeadMagnetEmail(body.email, body.subscriberId);
    return NextResponse.json({ ok: true, message: "Lead magnet email resent successfully." });
  } catch (error) {
    await markSubscriberFailure(body.subscriberId, error instanceof Error ? error.message : "Unknown email error");
    return NextResponse.json({ ok: false, message: "Resend failed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { subscriberId?: string };
  if (!body.subscriberId) return NextResponse.json({ message: "subscriberId required" }, { status: 400 });

  await deleteSubscriber(body.subscriberId);
  return NextResponse.json({ ok: true });
}
