import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

const VALID_CATEGORIES = ["braindump", "top3", "timeboxed"];

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { date, blockTime, text, category = "timeboxed", priority } = await req.json();

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (typeof text !== "string" || text.length === 0 || text.length > 500) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (category === "timeboxed") {
    if (typeof blockTime !== "string" || !/^\d{2}:\d{2}$/.test(blockTime)) {
      return NextResponse.json({ error: "blockTime required for timeboxed" }, { status: 400 });
    }
  }

  if (category === "top3") {
    if (![1, 2, 3].includes(priority)) {
      return NextResponse.json({ error: "priority 1-3 required for top3" }, { status: 400 });
    }
    const existing = await prisma.task.count({
      where: { userId: user.id, date, category: "top3" },
    });
    if (existing >= 3) {
      return NextResponse.json({ error: "Max 3 top3 tasks" }, { status: 400 });
    }
  }

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      date,
      blockTime: category === "timeboxed" ? blockTime : null,
      text,
      category,
      priority: category === "top3" ? priority : null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
