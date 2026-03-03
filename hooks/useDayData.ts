"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DayData, Task, ApiTask } from "@/lib/types";

export function useDayData(date: string) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    fetch(`/api/days/${date}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setLoaded(true);
      });
  }, [date]);

  // Timeboxed tasks grouped by blockTime (existing DayView behavior)
  const dayData: DayData = useMemo(() => {
    const blocks: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (t.category !== "timeboxed" || !t.blockTime) continue;
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

  // Brain dump tasks
  const brainDumpTasks = useMemo(
    () => tasks.filter((t) => t.category === "braindump"),
    [tasks]
  );

  // Top 3 tasks sorted by priority
  const top3Tasks = useMemo(
    () => tasks.filter((t) => t.category === "top3").sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
    [tasks]
  );

  // Add timeboxed task (existing)
  const addTask = useCallback(
    async (blockTime: string, text: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, blockTime, text, category: "timeboxed" }),
      });
      const task: ApiTask = await res.json();
      setTasks((prev) => [...prev, task]);
    },
    [date]
  );

  // Add brain dump task
  const addBrainDump = useCallback(
    async (text: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, text, category: "braindump" }),
      });
      const task: ApiTask = await res.json();
      setTasks((prev) => [...prev, task]);
    },
    [date]
  );

  // Add top 3 task
  const addTop3 = useCallback(
    async (text: string, priority: number) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, text, category: "top3", priority }),
      });
      const task: ApiTask = await res.json();
      setTasks((prev) => [...prev, task]);
    },
    [date]
  );

  // Promote brain dump → top 3
  const promoteToTop3 = useCallback(
    async (taskId: string, priority: number) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, category: "top3" as const, priority } : t))
      );
      fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "top3", priority }),
      });
    },
    []
  );

  // Demote top 3 → brain dump
  const demoteFromTop3 = useCallback(
    async (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, category: "braindump" as const, priority: null } : t))
      );
      fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "braindump", priority: null }),
      });
    },
    []
  );

  // Toggle done (works for all categories)
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

  // Move an existing task (from another date) into today's brain dump
  const importTask = useCallback(
    async (taskId: string, text: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, category: "braindump", priority: null }),
      });
      if (res.ok) {
        const now = new Date().toISOString();
        setTasks((prev) => [
          ...prev,
          { id: taskId, date, blockTime: null, text, done: false, category: "braindump", priority: null, createdAt: now },
        ]);
      }
    },
    [date]
  );

  // Delete (works for all categories)
  const deleteTask = useCallback(
    async (_blockTime: string, taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    },
    []
  );

  return {
    dayData,
    brainDumpTasks,
    top3Tasks,
    addTask,
    addBrainDump,
    addTop3,
    promoteToTop3,
    demoteFromTop3,
    toggleTask,
    importTask,
    deleteTask,
    loaded,
  };
}
