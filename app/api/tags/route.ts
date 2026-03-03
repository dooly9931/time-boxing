import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { name, color } = await req.json();

  if (typeof name !== "string" || name.length === 0 || name.length > 50) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const tag = await prisma.tag.create({
    data: { userId: user.id, name, color: color || "#8A9A7B" },
  });

  return NextResponse.json(tag, { status: 201 });
}
