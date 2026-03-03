"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";

export interface IncompleteGroup {
  date: string;
  tasks: (Task & { blockTime: string })[];
}

interface ApiTask {
  id: string;
  date: string;
  blockTime: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export function useIncomplete() {
  const [groups, setGroups] = useState<IncompleteGroup[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/incomplete")
      .then((r) => r.json())
      .then((tasks: ApiTask[]) => {
        const byDate: Record<string, (Task & { blockTime: string })[]> = {};
        for (const t of tasks) {
          if (!byDate[t.date]) byDate[t.date] = [];
          byDate[t.date].push({
            id: t.id,
            text: t.text,
            done: t.done,
            createdAt: t.createdAt,
            blockTime: t.blockTime,
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
