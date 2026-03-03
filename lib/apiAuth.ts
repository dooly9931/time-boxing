import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function getSessionUser(): Promise<{ id: string; name?: string | null; email?: string | null } | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return { id: session.user.id, name: session.user.name, email: session.user.email };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
