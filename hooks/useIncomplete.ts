"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { getAllDayKeys, getDayData } from "@/lib/storage";
import { today } from "@/lib/dateUtils";

export interface IncompleteGroup {
  date: string;
  tasks: (Task & { blockTime: string })[];
}

export function useIncomplete() {
  const [groups, setGroups] = useState<IncompleteGroup[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const todayStr = today();
    const allKeys = getAllDayKeys();
    const result: IncompleteGroup[] = [];

    for (const date of allKeys) {
      if (date >= todayStr) continue;
      const dayData = getDayData(date);
      const tasks: (Task & { blockTime: string })[] = [];

      for (const [blockTime, blockTasks] of Object.entries(dayData.blocks)) {
        for (const task of blockTasks) {
          if (!task.done) {
            tasks.push({ ...task, blockTime });
          }
        }
      }

      if (tasks.length > 0) {
        result.push({ date, tasks });
      }
    }

    setGroups(result);
    setLoaded(true);
  }, []);

  return { groups, loaded };
}
