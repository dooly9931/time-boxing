"use client";

import { useState, useEffect } from "react";
import { Task, ApiTask } from "@/lib/types";

export interface IncompleteGroup {
  date: string;
  tasks: (Task & { blockTime: string; category: string })[];
}

export function useIncomplete() {
  const [groups, setGroups] = useState<IncompleteGroup[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/incomplete")
      .then((r) => r.json())
      .then((tasks: ApiTask[]) => {
        const byDate: Record<string, (Task & { blockTime: string; category: string })[]> = {};
        for (const t of tasks) {
          if (!byDate[t.date]) byDate[t.date] = [];
          byDate[t.date].push({
            id: t.id,
            text: t.text,
            done: t.done,
            createdAt: t.createdAt,
            blockTime: t.blockTime ?? (t.category === "top3" ? "Top 3" : "메모"),
            category: t.category,
          });
        }
        const result = Object.entries(byDate)
          .map(([date, tasks]) => ({ date, tasks }))
          .sort((a, b) => b.date.localeCompare(a.date));
        setGroups(result);
        setLoaded(true);
      });
  }, []);

  return { groups, loaded };
}
