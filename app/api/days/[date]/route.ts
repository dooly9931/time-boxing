import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { date } = await params;

  const tasks = await prisma.task.findMany({
    where: { userId: user.id, date },
    orderBy: [{ blockTime: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(tasks);
}
