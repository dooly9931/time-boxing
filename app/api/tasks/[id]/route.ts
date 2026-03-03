import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.done === "boolean") data.done = body.done;
  if (typeof body.text === "string" && body.text.length > 0 && body.text.length <= 500) data.text = body.text;
  if (typeof body.category === "string" && ["braindump", "top3", "timeboxed"].includes(body.category)) {
    data.category = body.category;
    if (body.category !== "top3") data.priority = null;
  }
  if (body.priority === null || [1, 2, 3].includes(body.priority)) data.priority = body.priority;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const task = await prisma.task.updateMany({
    where: { id, userId: user.id },
    data,
  });

  if (task.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;

  const task = await prisma.task.deleteMany({
    where: { id, userId: user.id },
  });

  if (task.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
