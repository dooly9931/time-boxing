import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const { tagId } = await req.json();

  // Verify task belongs to user
  const task = await prisma.task.findFirst({ where: { id, userId: user.id } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const taskTag = await prisma.taskTag.create({
    data: { taskId: id, tagId },
  });

  return NextResponse.json(taskTag, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const { tagId } = await req.json();

  await prisma.taskTag.deleteMany({
    where: { taskId: id, tagId },
  });

  return NextResponse.json({ ok: true });
}
