import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";
import { today } from "@/lib/dateUtils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      done: false,
      date: { lt: today() },
    },
    orderBy: [{ date: "desc" }, { blockTime: "asc" }],
  });

  return NextResponse.json(tasks);
}
