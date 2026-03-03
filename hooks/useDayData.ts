"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { DayData, Task } from "@/lib/types";

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useDayData(date: string) {
  const [dayData, setDayData, loaded] = useLocalStorage<DayData>(
    `tbp_day_${date}`,
    { date, blocks: {} }
  );

  const addTask = useCallback(
    (blockTime: string, text: string) => {
      const task: Task = {
        id: genId(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
      };
      setDayData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockTime]: [...(prev.blocks[blockTime] || []), task],
        },
      }));
    },
    [setDayData]
  );

  const toggleTask = useCallback(
    (blockTime: string, taskId: string) => {
      setDayData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockTime]: (prev.blocks[blockTime] || []).map((t) =>
            t.id === taskId ? { ...t, done: !t.done } : t
          ),
        },
      }));
    },
    [setDayData]
  );

  const deleteTask = useCallback(
    (blockTime: string, taskId: string) => {
      setDayData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockTime]: (prev.blocks[blockTime] || []).filter(
            (t) => t.id !== taskId
          ),
        },
      }));
    },
    [setDayData]
  );

  return { dayData, addTask, toggleTask, deleteTask, loaded };
}
