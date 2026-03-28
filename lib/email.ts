import tls from "node:tls";
import { randomUUID } from "node:crypto";
import { resolveEmailTransport, updateEmailDiagnostics } from "@/lib/email-settings-store";

function escapeHeader(value: string) {
  return value.replace(/[\r\n]/g, " ").slice(0, 200);
}

function chunkToLines(buffer: string) {
  return buffer.split(/\r?\n/).filter(Boolean);
}

async function runSmtp(commands: { expect: number[]; command?: string }[]) {
  const config = await resolveEmailTransport();
  if (!config.secure) throw new Error("This transport currently requires secure SSL enabled.");
  if (!config.pass) throw new Error("SMTP password is missing.");

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
  const config = await resolveEmailTransport();

  try {
    await runSmtp([
      { expect: [220] },
      { command: "EHLO elevareai.store", expect: [250] },
      { command: "AUTH LOGIN", expect: [334] },
      { command: Buffer.from(config.user).toString("base64"), expect: [334] },
      { command: Buffer.from(config.pass).toString("base64"), expect: [235] }
    ]);
    await updateEmailDiagnostics({ connectionStatus: "success" });
    return true;
  } catch (error) {
    await updateEmailDiagnostics({ connectionStatus: "failed" });
    throw error;
  }
}

export async function sendMail(input: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const config = await resolveEmailTransport();
  const boundary = `boundary-${randomUUID()}`;
  const message = [
    `From: ${escapeHeader(config.senderName)} <${config.senderEmail}>`,
    `To: ${escapeHeader(input.to)}`,
    `Subject: ${escapeHeader(input.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=${boundary}`,
    ...(input.replyTo || config.replyToEmail ? [`Reply-To: ${escapeHeader(input.replyTo || config.replyToEmail || "")}`] : []),
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

  try {
    await runSmtp([
      { expect: [220] },
      { command: "EHLO elevareai.store", expect: [250] },
      { command: "AUTH LOGIN", expect: [334] },
      { command: Buffer.from(config.user).toString("base64"), expect: [334] },
      { command: Buffer.from(config.pass).toString("base64"), expect: [235] },
      { command: `MAIL FROM:<${config.senderEmail}>`, expect: [250] },
      { command: `RCPT TO:<${input.to}>`, expect: [250, 251] },
      { command: "DATA", expect: [354] },
      { command: `${message}\r\n.`, expect: [250] }
    ]);
    await updateEmailDiagnostics({ emailStatus: "success" });
    return { accepted: [input.to] };
  } catch (error) {
    await updateEmailDiagnostics({ emailStatus: "failed" });
    throw error;
  }
}
