"use client";

import { useState, useEffect, useCallback } from "react";
import { StreakData } from "@/lib/types";

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, todayStars: 0 });
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/streak")
      .then((r) => r.json())
      .then((data: StreakData) => {
        setStreak(data);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { streak, loaded, refresh };
}
