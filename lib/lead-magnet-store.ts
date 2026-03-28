import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { readCollection } from "@/lib/content-store";
import { readFiles } from "@/lib/file-store";
import { sendMail } from "@/lib/email";
import { resolveEmailTransport } from "@/lib/email-settings-store";

export type LeadMagnetSettings = {
  id: string;
  name: string;
  slug: string;
  publicTitle: string;
  publicDescription: string;
  buttonLabel: string;
  successMessage: string;
  emailSubject: string;
  emailPreviewText: string;
  emailIntro: string;
  emailClosing: string;
  senderName?: string;
  senderEmail?: string;
  replyToEmail?: string;
  isActive: boolean;
  resendOnDuplicate: boolean;
  sendAdminNotification: boolean;
  selectedResourceIds: string[];
  primaryResourceId?: string;
  updatedAt: string;
};

export type LeadSubscriber = {
  id: string;
  email: string;
  source: string;
  leadMagnetId: string;
  status: "subscribed";
  subscribedAt: string;
  emailedAt?: string;
  emailDeliveryStatus: "pending" | "sent" | "failed";
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  userAgent?: string;
  ipAddress?: string;
};

const SETTINGS_PATH = path.join(process.cwd(), "storage", "lead-magnet.json");
const SUBSCRIBERS_PATH = path.join(process.cwd(), "storage", "lead-subscribers.json");

const defaultSettings: LeadMagnetSettings = {
  id: "default",
  name: "Freelancer Checklist",
  slug: "freelancer-protection-checklist",
  publicTitle: "Get the Freelancer Protection Checklist",
  publicDescription: "A concise pre-client checklist to avoid weak terms, vague scope, and payment friction.",
  buttonLabel: "Send me the checklist",
  successMessage: "You're in — check your inbox for your resources.",
  emailSubject: "Your Freelancer Protection Checklist is here",
  emailPreviewText: "Access your ScopeGuard checklist and bonus downloads.",
  emailIntro: "Thanks for requesting the Freelancer Protection Checklist. Here are your resources:",
  emailClosing: "If you need anything else, reply to this email and we’ll help.",
  isActive: true,
  resendOnDuplicate: true,
  sendAdminNotification: false,
  selectedResourceIds: [],
  updatedAt: new Date().toISOString()
};

async function readJson<T>(filePath: string, fallback: T) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

export async function getLeadMagnetSettings() {
  return readJson<LeadMagnetSettings>(SETTINGS_PATH, defaultSettings);
}

export async function saveLeadMagnetSettings(input: Partial<LeadMagnetSettings>) {
  const current = await getLeadMagnetSettings();
  const next: LeadMagnetSettings = {
    ...current,
    ...input,
    selectedResourceIds: Array.from(new Set(input.selectedResourceIds || current.selectedResourceIds)),
    updatedAt: new Date().toISOString()
  };
  await writeJson(SETTINGS_PATH, next);
  return next;
}

export async function getSubscribers() {
  return readJson<LeadSubscriber[]>(SUBSCRIBERS_PATH, []);
}

async function saveSubscribers(next: LeadSubscriber[]) {
  await writeJson(SUBSCRIBERS_PATH, next);
}

export async function upsertSubscriber(input: { email: string; source: string; leadMagnetId: string; userAgent?: string; ipAddress?: string }) {
  const subscribers = await getSubscribers();
  const existing = subscribers.find((item) => item.email.toLowerCase() === input.email.toLowerCase() && item.leadMagnetId === input.leadMagnetId);
  if (existing) {
    existing.updatedAt = new Date().toISOString();
    existing.userAgent = input.userAgent;
    existing.ipAddress = input.ipAddress;
    await saveSubscribers(subscribers);
    return { subscriber: existing, duplicate: true };
  }

  const now = new Date().toISOString();
  const created: LeadSubscriber = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    source: input.source,
    leadMagnetId: input.leadMagnetId,
    status: "subscribed",
    subscribedAt: now,
    emailDeliveryStatus: "pending",
    createdAt: now,
    updatedAt: now,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress
  };

  await saveSubscribers([created, ...subscribers]);
  return { subscriber: created, duplicate: false };
}

async function updateSubscriber(subscriberId: string, patch: Partial<LeadSubscriber>) {
  const subscribers = await getSubscribers();
  const idx = subscribers.findIndex((item) => item.id === subscriberId);
  if (idx < 0) return;
  subscribers[idx] = { ...subscribers[idx], ...patch, updatedAt: new Date().toISOString() };
  await saveSubscribers(subscribers);
}

export async function deleteSubscriber(subscriberId: string) {
  const subscribers = await getSubscribers();
  await saveSubscribers(subscribers.filter((item) => item.id !== subscriberId));
}

export async function getLeadMagnetResources(settings?: LeadMagnetSettings) {
  const lead = settings || (await getLeadMagnetSettings());
  const [resources, files] = await Promise.all([readCollection("resources"), readFiles()]);
  const fileMap = new Map(files.map((f) => [f.id, f]));

  return lead.selectedResourceIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter(Boolean)
    .map((resource) => {
      const file = resource?.fileId ? fileMap.get(resource.fileId) : undefined;
      const url = resource?.externalUrl || file?.publicUrl || "";
      return {
        id: resource!.id,
        title: resource!.title,
        summary: resource!.summary,
        label: resource!.label,
        url
      };
    })
    .filter((item) => Boolean(item.url));
}

export async function sendLeadMagnetEmail(email: string, subscriberId?: string) {
  const settings = await getLeadMagnetSettings();
  if (!settings.isActive) throw new Error("Lead magnet delivery is inactive.");

  const resources = await getLeadMagnetResources(settings);
  if (!resources.length) throw new Error("No lead magnet resources are configured.");

  const transport = await resolveEmailTransport();
  const subject = settings.emailSubject;
  const intro = settings.emailIntro;
  const closing = settings.emailClosing;
  const lines = resources.map((item) => `- ${item.title}: ${item.url}`).join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0b0d12;max-width:640px;margin:0 auto;padding:24px;">
      <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#5f79ff;">ScopeGuard Resources</p>
      <h2 style="margin:8px 0 12px;font-size:24px;">Your requested resources are ready</h2>
      <p>${intro}</p>
      <ul>
        ${resources.map((item) => `<li><a href="${item.url}" style="color:#1f3bdb;">${item.title}</a> — ${item.summary}</li>`).join("")}
      </ul>
      <p>${closing}</p>
      <p style="color:#5f6372;font-size:12px;">Support: contact@elevareai.store</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject,
    text: `${settings.emailPreviewText}\n\n${intro}\n${lines}\n\n${closing}`,
    html,
    replyTo: settings.replyToEmail || transport.replyToEmail
  });

  if (subscriberId) {
    await updateSubscriber(subscriberId, { emailedAt: new Date().toISOString(), emailDeliveryStatus: "sent", lastError: undefined });
  }

  return { ok: true };
}

export async function markSubscriberFailure(subscriberId: string, message: string) {
  await updateSubscriber(subscriberId, { emailDeliveryStatus: "failed", lastError: message });
}

export async function leadMagnetMetrics() {
  const subs = await getSubscribers();
  return {
    totalSubmissions: subs.length,
    sent: subs.filter((item) => item.emailDeliveryStatus === "sent").length,
    failed: subs.filter((item) => item.emailDeliveryStatus === "failed").length,
    lastSubmissionAt: subs[0]?.subscribedAt || null
  };
}
