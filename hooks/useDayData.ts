"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DayData, Task } from "@/lib/types";

interface ApiTask {
  id: string;
  date: string;
  blockTime: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export function useDayData(date: string) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    fetch(`/api/days/${date}`)
      .then((r) => r.json())
      .then((data: ApiTask[]) => {
        setTasks(data);
        setLoaded(true);
      });
  }, [date]);

  const dayData: DayData = useMemo(() => {
    const blocks: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!blocks[t.blockTime]) blocks[t.blockTime] = [];
      blocks[t.blockTime].push({
        id: t.id,
        text: t.text,
        done: t.done,
        createdAt: t.createdAt,
      });
    }
    return { date, blocks };
  }, [tasks, date]);

  const addTask = useCallback(
    async (blockTime: string, text: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, blockTime, text }),
      });
      const task: ApiTask = await res.json();
      setTasks((prev) => [...prev, task]);
    },
    [date]
  );

  const toggleTask = useCallback(
    async (_blockTime: string, taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
      );
      fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !(tasks.find((t) => t.id === taskId)?.done) }),
      });
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (_blockTime: string, taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    },
    []
  );

  return { dayData, addTask, toggleTask, deleteTask, loaded };
}
