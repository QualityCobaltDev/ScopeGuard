import { NextResponse } from "next/server";
import { createArrayItem, deleteArrayItem, readCollection, updateArrayItem, writeCollection } from "@/lib/content-store";
import { CollectionName } from "@/lib/content-types";
import { requireAdmin } from "@/lib/permissions";

const COLLECTIONS: CollectionName[] = ["site", "pricing", "testimonials", "faq", "products", "resources"];

function validateCollection(collection: string): collection is CollectionName {
  return COLLECTIONS.includes(collection as CollectionName);
}

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!validateCollection(collection)) return NextResponse.json({ message: "Invalid collection" }, { status: 404 });
  return NextResponse.json(await readCollection(collection));
}

async function authGuard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const denied = await authGuard();
  if (denied) return denied;
  const { collection } = await params;
  if (!validateCollection(collection)) return NextResponse.json({ message: "Invalid collection" }, { status: 404 });
  const body = await req.json();

  if (collection === "site" || collection === "products") return NextResponse.json(await writeCollection(collection, body));
  return NextResponse.json(await createArrayItem(collection, body));
}

export async function PUT(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const denied = await authGuard();
  if (denied) return denied;
  const { collection } = await params;
  if (!validateCollection(collection)) return NextResponse.json({ message: "Invalid collection" }, { status: 404 });
  const body = (await req.json()) as { id?: string; payload?: unknown };

  if (body.payload && (collection === "site" || collection === "products" || Array.isArray(body.payload))) {
    return NextResponse.json(await writeCollection(collection, body.payload as never));
  }

  if (collection === "site" || collection === "products") {
    return NextResponse.json({ message: "payload required" }, { status: 400 });
  }

  if (!body.id || !body.payload || typeof body.payload !== "object") {
    return NextResponse.json({ message: "id and object payload required" }, { status: 400 });
  }

  return NextResponse.json(await updateArrayItem(collection, body.id, body.payload as Record<string, unknown>));
}

export async function DELETE(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const denied = await authGuard();
  if (denied) return denied;
  const { collection } = await params;
  if (!validateCollection(collection)) return NextResponse.json({ message: "Invalid collection" }, { status: 404 });
  if (collection === "site" || collection === "products") return NextResponse.json({ message: "Delete is not supported for this collection" }, { status: 400 });

  const body = (await req.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ message: "id required" }, { status: 400 });
  return NextResponse.json(await deleteArrayItem(collection, body.id));
}
