import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type UploadedFileRecord = {
  id: string;
  title: string;
  description: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
  publicUrl: string;
  createdAt: string;
  visibility: "public" | "gated" | "internal";
};

const STORAGE_DIR = path.join(process.cwd(), "storage");
const FILES_PATH = path.join(STORAGE_DIR, "files.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "resources");

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain"
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".csv", ".txt"]);
const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

function normalizeName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readFiles() {
  try {
    const raw = await fs.readFile(FILES_PATH, "utf-8");
    return JSON.parse(raw) as UploadedFileRecord[];
  } catch {
    return [];
  }
}

async function writeFiles(payload: UploadedFileRecord[]) {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.writeFile(FILES_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

export function validateUpload(file: File) {
  const ext = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) throw new Error("Unsupported file extension.");
  if (!ALLOWED_MIME.has(file.type)) throw new Error("Unsupported file type.");
  if (file.size > MAX_UPLOAD_SIZE) throw new Error("File exceeds 15MB limit.");
}

export async function persistUploadedFile(input: {
  file: File;
  title: string;
  description: string;
  visibility: "public" | "gated" | "internal";
}) {
  await ensureUploadDir();
  validateUpload(input.file);

  const ext = path.extname(input.file.name).toLowerCase();
  const storedName = `${Date.now()}-${randomUUID()}${ext}`;
  const safeOriginal = normalizeName(input.file.name);
  const filePath = path.join(UPLOAD_DIR, storedName);
  const arr = Buffer.from(await input.file.arrayBuffer());
  await fs.writeFile(filePath, arr);

  const record: UploadedFileRecord = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    originalName: safeOriginal,
    storedName,
    mimeType: input.file.type,
    size: input.file.size,
    path: `/uploads/resources/${storedName}`,
    publicUrl: `/uploads/resources/${storedName}`,
    createdAt: new Date().toISOString(),
    visibility: input.visibility
  };

  const current = await readFiles();
  await writeFiles([record, ...current]);
  return record;
}

export async function replaceFile(id: string, file: File) {
  validateUpload(file);
  const records = await readFiles();
  const idx = records.findIndex((item) => item.id === id);
  if (idx < 0) throw new Error("File not found");

  const ext = path.extname(file.name).toLowerCase();
  const nextStoredName = `${Date.now()}-${randomUUID()}${ext}`;
  const arr = Buffer.from(await file.arrayBuffer());
  await ensureUploadDir();
  await fs.writeFile(path.join(UPLOAD_DIR, nextStoredName), arr);

  const prevStored = records[idx].storedName;
  records[idx] = {
    ...records[idx],
    originalName: normalizeName(file.name),
    storedName: nextStoredName,
    mimeType: file.type,
    size: file.size,
    path: `/uploads/resources/${nextStoredName}`,
    publicUrl: `/uploads/resources/${nextStoredName}`,
    createdAt: new Date().toISOString()
  };

  await writeFiles(records);
  await fs.unlink(path.join(UPLOAD_DIR, prevStored)).catch(() => undefined);
  return records[idx];
}

export async function updateFileMetadata(
  id: string,
  patch: Partial<Pick<UploadedFileRecord, "title" | "description" | "visibility">>
) {
  const records = await readFiles();
  const idx = records.findIndex((item) => item.id === id);
  if (idx < 0) throw new Error("File not found");
  records[idx] = { ...records[idx], ...patch };
  await writeFiles(records);
  return records[idx];
}

export async function deleteFile(id: string) {
  const records = await readFiles();
  const target = records.find((item) => item.id === id);
  if (!target) return false;
  await writeFiles(records.filter((item) => item.id !== id));
  await fs.unlink(path.join(UPLOAD_DIR, target.storedName)).catch(() => undefined);
  return true;
}

export const uploadConstraints = {
  allowedExtensions: Array.from(ALLOWED_EXTENSIONS),
  maxUploadSizeMb: MAX_UPLOAD_SIZE / (1024 * 1024)
};
