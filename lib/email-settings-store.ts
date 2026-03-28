import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type EmailSettingsRecord = {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPasswordEncrypted?: string;
  senderEmail: string;
  senderName: string;
  replyToEmail?: string;
  defaultTestRecipient: string;
  isActive: boolean;
  lastConnectionTestAt?: string;
  lastConnectionTestStatus?: "success" | "failed";
  lastTestEmailAt?: string;
  lastTestEmailStatus?: "success" | "failed";
  updatedAt: string;
  updatedBy?: string;
};

const SETTINGS_PATH = path.join(process.cwd(), "storage", "email-settings.json");
const FALLBACK = {
  smtpHost: "mail.spacemail.com",
  smtpPort: Number(process.env.SMTP_PORT ?? 465),
  smtpSecure: String(process.env.SMTP_SECURE ?? "true") === "true",
  smtpUser: process.env.SMTP_USER ?? "contact@elevareai.store",
  senderEmail: process.env.SMTP_USER ?? "contact@elevareai.store",
  senderName: "ScopeGuard",
  replyToEmail: process.env.CONTACT_EMAIL ?? "contact@elevareai.store",
  defaultTestRecipient: process.env.CONTACT_EMAIL ?? "contact@elevareai.store",
  isActive: true
};

function getSecret() {
  const source = process.env.SETTINGS_ENCRYPTION_KEY || process.env.AUTH_SECRET || "scopeguard-default-dev-key";
  return createHash("sha256").update(source).digest();
}

function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getSecret(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decrypt(value: string) {
  const [ivRaw, tagRaw, payloadRaw] = value.split(".");
  if (!ivRaw || !tagRaw || !payloadRaw) return "";
  const decipher = createDecipheriv("aes-256-gcm", getSecret(), Buffer.from(ivRaw, "base64"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(payloadRaw, "base64")), decipher.final()]);
  return plain.toString("utf8");
}

export async function readRawEmailSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    return JSON.parse(raw) as EmailSettingsRecord;
  } catch {
    return null;
  }
}

export async function writeRawEmailSettings(next: EmailSettingsRecord) {
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
}

export async function getEmailSettingsForAdmin() {
  const raw = await readRawEmailSettings();
  return {
    smtpHost: raw?.smtpHost ?? FALLBACK.smtpHost,
    smtpPort: raw?.smtpPort ?? FALLBACK.smtpPort,
    smtpSecure: raw?.smtpSecure ?? FALLBACK.smtpSecure,
    smtpUser: raw?.smtpUser ?? FALLBACK.smtpUser,
    senderEmail: raw?.senderEmail ?? FALLBACK.senderEmail,
    senderName: raw?.senderName ?? FALLBACK.senderName,
    replyToEmail: raw?.replyToEmail ?? FALLBACK.replyToEmail,
    defaultTestRecipient: raw?.defaultTestRecipient ?? FALLBACK.defaultTestRecipient,
    isActive: raw?.isActive ?? true,
    hasPassword: Boolean(raw?.smtpPasswordEncrypted || process.env.SMTP_PASS),
    lastConnectionTestAt: raw?.lastConnectionTestAt,
    lastConnectionTestStatus: raw?.lastConnectionTestStatus,
    lastTestEmailAt: raw?.lastTestEmailAt,
    lastTestEmailStatus: raw?.lastTestEmailStatus,
    updatedAt: raw?.updatedAt,
    updatedBy: raw?.updatedBy,
    usingEnvFallback: !raw
  };
}

export async function resolveEmailTransport() {
  const raw = await readRawEmailSettings();
  const pass = raw?.smtpPasswordEncrypted ? decrypt(raw.smtpPasswordEncrypted) : process.env.SMTP_PASS;

  return {
    host: raw?.smtpHost ?? FALLBACK.smtpHost,
    port: raw?.smtpPort ?? FALLBACK.smtpPort,
    secure: raw?.smtpSecure ?? FALLBACK.smtpSecure,
    user: raw?.smtpUser ?? FALLBACK.smtpUser,
    pass: pass ?? "",
    senderEmail: raw?.senderEmail ?? FALLBACK.senderEmail,
    senderName: raw?.senderName ?? FALLBACK.senderName,
    replyToEmail: raw?.replyToEmail ?? FALLBACK.replyToEmail,
    defaultTestRecipient: raw?.defaultTestRecipient ?? FALLBACK.defaultTestRecipient,
    isActive: raw?.isActive ?? true
  };
}

export async function updateEmailSettings(
  input: {
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUser: string;
    senderEmail: string;
    senderName: string;
    replyToEmail?: string;
    defaultTestRecipient: string;
    isActive: boolean;
    smtpPassword?: string;
    clearPassword?: boolean;
  },
  updatedBy: string
) {
  const current = await readRawEmailSettings();

  const next: EmailSettingsRecord = {
    smtpHost: input.smtpHost.trim(),
    smtpPort: Number(input.smtpPort),
    smtpSecure: Boolean(input.smtpSecure),
    smtpUser: input.smtpUser.trim(),
    senderEmail: input.senderEmail.trim(),
    senderName: input.senderName.trim() || "ScopeGuard",
    replyToEmail: input.replyToEmail?.trim() || undefined,
    defaultTestRecipient: input.defaultTestRecipient.trim(),
    isActive: Boolean(input.isActive),
    smtpPasswordEncrypted: current?.smtpPasswordEncrypted,
    lastConnectionTestAt: current?.lastConnectionTestAt,
    lastConnectionTestStatus: current?.lastConnectionTestStatus,
    lastTestEmailAt: current?.lastTestEmailAt,
    lastTestEmailStatus: current?.lastTestEmailStatus,
    updatedAt: new Date().toISOString(),
    updatedBy
  };

  if (input.clearPassword) next.smtpPasswordEncrypted = undefined;
  if (input.smtpPassword && input.smtpPassword.trim()) next.smtpPasswordEncrypted = encrypt(input.smtpPassword.trim());

  await writeRawEmailSettings(next);
  return next;
}

export async function updateEmailDiagnostics(patch: {
  connectionStatus?: "success" | "failed";
  emailStatus?: "success" | "failed";
}) {
  const current = (await readRawEmailSettings()) || {
    ...FALLBACK,
    updatedAt: new Date().toISOString()
  };

  const next: EmailSettingsRecord = {
    ...current,
    smtpHost: current.smtpHost,
    smtpPort: current.smtpPort,
    smtpSecure: current.smtpSecure,
    smtpUser: current.smtpUser,
    senderEmail: current.senderEmail,
    senderName: current.senderName,
    defaultTestRecipient: current.defaultTestRecipient,
    isActive: current.isActive,
    smtpPasswordEncrypted: current.smtpPasswordEncrypted,
    updatedAt: current.updatedAt
  };

  if (patch.connectionStatus) {
    next.lastConnectionTestStatus = patch.connectionStatus;
    next.lastConnectionTestAt = new Date().toISOString();
  }
  if (patch.emailStatus) {
    next.lastTestEmailStatus = patch.emailStatus;
    next.lastTestEmailAt = new Date().toISOString();
  }

  await writeRawEmailSettings(next);
}
