import tls from "node:tls";
import { randomUUID } from "node:crypto";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  contactEmail: string;
};

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function getEmailConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST ?? "mail.spacemail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = String(process.env.SMTP_SECURE ?? "true") === "true";
  const user = requiredEnv("SMTP_USER", "contact@elevareai.store");
  const pass = requiredEnv("SMTP_PASS");
  const contactEmail = process.env.CONTACT_EMAIL ?? "contact@elevareai.store";

  return { host, port, secure, user, pass, contactEmail };
}

export function maskedEmailStatus() {
  const pass = process.env.SMTP_PASS;
  return {
    active: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && pass),
    host: process.env.SMTP_HOST ?? "mail.spacemail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? "true") === "true",
    username: process.env.SMTP_USER ?? "contact@elevareai.store",
    passwordMasked: pass ? "••••••••" : "Not set",
    contactEmail: process.env.CONTACT_EMAIL ?? "contact@elevareai.store"
  };
}

function escapeHeader(value: string) {
  return value.replace(/[\r\n]/g, " ").slice(0, 200);
}

function chunkToLines(buffer: string) {
  return buffer.split(/\r?\n/).filter(Boolean);
}

async function runSmtp(commands: { expect: number[]; command?: string }[]) {
  const config = getEmailConfig();
  if (!config.secure) throw new Error("Only secure SMTP is supported in this deployment.");

  const socket = tls.connect({ host: config.host, port: config.port, servername: config.host });
  socket.setEncoding("utf8");

  let data = "";
  const readResponse = () =>
    new Promise<number>((resolve, reject) => {
      const onData = (chunk: string) => {
        data += chunk;
        const lines = chunkToLines(data);
        if (!lines.length) return;
        const last = lines[lines.length - 1];
        if (/^\d{3}\s/.test(last)) {
          socket.off("data", onData);
          const code = Number(last.slice(0, 3));
          resolve(code);
        }
      };
      const onErr = (err: Error) => {
        socket.off("data", onData);
        reject(err);
      };
      socket.on("data", onData);
      socket.once("error", onErr);
    });

  try {
    for (const step of commands) {
      if (step.command) socket.write(`${step.command}\r\n`);
      const code = await readResponse();
      if (!step.expect.includes(code)) {
        throw new Error(`SMTP command failed with code ${code}`);
      }
    }
    socket.end("QUIT\r\n");
  } finally {
    socket.end();
  }
}

export async function verifySmtpConnection() {
  const config = getEmailConfig();
  await runSmtp([
    { expect: [220] },
    { command: "EHLO elevareai.store", expect: [250] },
    { command: "AUTH LOGIN", expect: [334] },
    { command: Buffer.from(config.user).toString("base64"), expect: [334] },
    { command: Buffer.from(config.pass).toString("base64"), expect: [235] }
  ]);
  return true;
}

export async function sendMail(input: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const config = getEmailConfig();
  const boundary = `boundary-${randomUUID()}`;
  const message = [
    `From: ScopeGuard <${config.user}>`,
    `To: ${escapeHeader(input.to)}`,
    `Subject: ${escapeHeader(input.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=${boundary}`,
    ...(input.replyTo ? [`Reply-To: ${escapeHeader(input.replyTo)}`] : []),
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    input.text,
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    input.html,
    `--${boundary}--`,
    ""
  ].join("\r\n");

  await runSmtp([
    { expect: [220] },
    { command: "EHLO elevareai.store", expect: [250] },
    { command: "AUTH LOGIN", expect: [334] },
    { command: Buffer.from(config.user).toString("base64"), expect: [334] },
    { command: Buffer.from(config.pass).toString("base64"), expect: [235] },
    { command: `MAIL FROM:<${config.user}>`, expect: [250] },
    { command: `RCPT TO:<${input.to}>`, expect: [250, 251] },
    { command: "DATA", expect: [354] },
    { command: `${message}\r\n.`, expect: [250] }
  ]);

  return { accepted: [input.to] };
}
