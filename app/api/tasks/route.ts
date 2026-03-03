import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { date, blockTime, text } = await req.json();

  if (
    typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    typeof blockTime !== "string" || !/^\d{2}:\d{2}$/.test(blockTime) ||
    typeof text !== "string" || text.length === 0 || text.length > 500
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { userId: user.id, date, blockTime, text },
  });

  return NextResponse.json(task, { status: 201 });
}
