import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(
    settings ?? { timeUnit: 30, dayStart: "06:00", dayEnd: "23:00" }
  );
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { timeUnit, dayStart, dayEnd } = await req.json();

  if (
    ![5, 10, 15, 30].includes(timeUnit) ||
    typeof dayStart !== "string" || !/^\d{2}:\d{2}$/.test(dayStart) ||
    typeof dayEnd !== "string" || !/^\d{2}:\d{2}$/.test(dayEnd)
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const settings = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: { timeUnit, dayStart, dayEnd },
    create: { userId: user.id, timeUnit, dayStart, dayEnd },
  });

  return NextResponse.json(settings);
}
