import { NextResponse } from "next/server";
import { sendMail } from "@/lib/email";
import { resolveEmailTransport } from "@/lib/email-settings-store";

type Payload = { name?: string; email?: string; message?: string; company?: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Payload;
  if (body.company) return NextResponse.json({ ok: true });

  const name = sanitize(body.name ?? "");
  const email = sanitize(body.email ?? "");
  const message = sanitize(body.message ?? "");

  if (name.length < 2 || !emailRegex.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, message: "Please provide valid contact details." }, { status: 400 });
  }

  try {
    const transport = await resolveEmailTransport();
    const contactEmail = transport.defaultTestRecipient || process.env.CONTACT_EMAIL || "contact@elevareai.store";

    await sendMail({
      to: contactEmail,
      replyTo: email,
      subject: `New contact request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
    });

    await sendMail({
      to: email,
      subject: "We received your ScopeGuard message",
      text: `Hi ${name},\n\nThanks for contacting ScopeGuard. We received your message and will reply soon.`,
      html: `<p>Hi ${name},</p><p>Thanks for contacting ScopeGuard. We received your message and will reply soon.</p>`
    });

    return NextResponse.json({ ok: true, message: "Message sent successfully." });
  } catch {
    return NextResponse.json({ ok: false, message: "We could not send your message right now." }, { status: 500 });
  }
}
