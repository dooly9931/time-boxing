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

  const settings = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: { timeUnit, dayStart, dayEnd },
    create: { userId: user.id, timeUnit, dayStart, dayEnd },
  });

  return NextResponse.json(settings);
}
