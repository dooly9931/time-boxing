import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/apiAuth";
import { today, addDays } from "@/lib/dateUtils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const top3Tasks = await prisma.task.findMany({
    where: { userId: user.id, category: "top3" },
    select: { date: true, done: true },
    orderBy: { date: "desc" },
  });

  const byDate: Record<string, number> = {};
  for (const t of top3Tasks) {
    if (!byDate[t.date]) byDate[t.date] = 0;
    if (t.done) byDate[t.date]++;
  }

  const todayStr = today();
  const todayStars = byDate[todayStr] ?? 0;

  // Current streak: consecutive days with >= 1 star, walking back from today
  let currentStreak = 0;
  let d = todayStr;
  while (true) {
    const stars = byDate[d] ?? 0;
    if (stars > 0) {
      currentStreak++;
      d = addDays(d, -1);
    } else if (d === todayStr) {
      // Today has no stars yet — don't break, check yesterday
      d = addDays(d, -1);
    } else {
      break;
    }
  }

  // Longest streak
  const activeDates = Object.entries(byDate)
    .filter(([, v]) => v > 0)
    .map(([d]) => d)
    .sort();

  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const date of activeDates) {
    if (prev && addDays(prev, 1) === date) {
      run++;
    } else {
      run = 1;
    }
    if (run > longestStreak) longestStreak = run;
    prev = date;
  }

  return NextResponse.json({ currentStreak, longestStreak, todayStars });
}
