import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { deleteFile, persistUploadedFile, readFiles, replaceFile, updateFileMetadata, uploadConstraints } from "@/lib/file-store";
import { readCollection, writeCollection } from "@/lib/content-store";

async function guard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const files = await readFiles();
  return NextResponse.json({ files, constraints: uploadConstraints });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "file is required" }, { status: 400 });

  try {
    const created = await persistUploadedFile({
      file,
      title: String(form.get("title") || file.name),
      description: String(form.get("description") || ""),
      visibility: (String(form.get("visibility") || "public") as "public" | "gated" | "internal")
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

  const file = form.get("file");
  try {
    if (file instanceof File) {
      const replaced = await replaceFile(id, file);
      return NextResponse.json(replaced);
    }

    const updated = await updateFileMetadata(id, {
      title: form.get("title") ? String(form.get("title")) : undefined,
      description: form.get("description") ? String(form.get("description")) : undefined,
      visibility: form.get("visibility") ? (String(form.get("visibility")) as "public" | "gated" | "internal") : undefined
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

  await deleteFile(id);

  const resources = await readCollection("resources");
  const next = resources.map((resource) => (resource.fileId === id ? { ...resource, fileId: undefined } : resource));
  await writeCollection("resources", next);

  return NextResponse.json({ ok: true });
}
