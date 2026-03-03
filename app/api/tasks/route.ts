import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { date, blockTime, text } = await req.json();

  const task = await prisma.task.create({
    data: { userId: user.id, date, blockTime, text },
  });

  return NextResponse.json(task, { status: 201 });
}
