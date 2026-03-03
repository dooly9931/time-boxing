"use client";

import { useState, useEffect } from "react";
import { ApiTask } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";
import TaskInput from "./TaskInput";

interface Props {
  tasks: ApiTask[];
  onAdd: (text: string) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onPromote: (taskId: string, priority: number) => void;
  onImport: (taskId: string, text: string) => void;
  onCopy: (text: string) => void;
  top3Count: number;
}

export default function BrainDumpSection({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  onPromote,
  onImport,
  onCopy,
  top3Count,
}: Props) {
  const canPromote = top3Count < 3;
  const [showImport, setShowImport] = useState(false);
  const [incomplete, setIncomplete] = useState<ApiTask[]>([]);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    if (!showImport) return;
    setImportLoading(true);
    fetch("/api/incomplete")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setIncomplete(Array.isArray(data) ? data : []);
        setImportLoading(false);
      });
  }, [showImport]);

  const handleMove = (task: ApiTask) => {
    onImport(task.id, task.text);
    setIncomplete((prev) => prev.filter((t) => t.id !== task.id));
  };

  const handleCopy = (task: ApiTask) => {
    onCopy(task.text);
    setIncomplete((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[13px] font-medium text-olive">Brain Dump</h2>
        <button
          onClick={() => setShowImport(!showImport)}
          className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors ${
            showImport
              ? "bg-olive text-white"
              : "text-gray-400 hover:text-olive hover:bg-cream"
          }`}
        >
          {showImport ? "닫기" : "미완료 가져오기"}
        </button>
      </div>

      {showImport && (
        <ImportPanel
          items={incomplete}
          loading={importLoading}
          onMove={handleMove}
          onCopy={handleCopy}
        />
      )}

      <div className="bg-cream/40 rounded-xl p-3 space-y-1">
        {tasks.map((task) => (
          <BrainDumpItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
            onPromote={() => {
              const nextPriority = top3Count + 1;
              onPromote(task.id, nextPriority);
            }}
            canPromote={canPromote && !task.done}
          />
        ))}
        <TaskInput onAdd={onAdd} />
      </div>
    </div>
  );
}

function ImportPanel({
  items,
  loading,
  onMove,
  onCopy,
}: {
  items: ApiTask[];
  loading: boolean;
  onMove: (task: ApiTask) => void;
  onCopy: (task: ApiTask) => void;
}) {
  if (loading) {
    return (
      <div className="mb-3 p-3 bg-cream/40 rounded-xl text-center text-[11px] text-gray-300">
        로딩 중...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mb-3 p-3 bg-cream/40 rounded-xl text-center text-[11px] text-gray-400">
        미완료 작업이 없습니다
      </div>
    );
  }

  // Group by date
  const byDate: Record<string, ApiTask[]> = {};
  for (const t of items) {
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push(t);
  }
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mb-3 bg-cream/40 rounded-xl p-3 max-h-60 overflow-y-auto space-y-2">
      {dates.map((date) => (
        <div key={date}>
          <p className="text-[11px] text-gray-400 mb-1">{formatShortDate(date)}</p>
          {byDate[date].map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 py-1.5 pl-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="flex-1 text-[12px] text-gray-600 truncate">
                {task.text}
              </span>
              <button
                onClick={() => onMove(task)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors"
              >
                이동
              </button>
              <button
                onClick={() => onCopy(task)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-beige text-gray-600 hover:bg-sand transition-colors"
              >
                복사
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function BrainDumpItem({
  task,
  onToggle,
  onDelete,
  onPromote,
  canPromote,
}: {
  task: ApiTask;
  onToggle: () => void;
  onDelete: () => void;
  onPromote: () => void;
  canPromote: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 group">
      <button onClick={onToggle} className="flex-shrink-0">
        {task.done ? (
          <svg className="w-[18px] h-[18px] text-olive" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ) : (
          <div className="w-[18px] h-[18px] rounded-full border-2 border-sand" />
        )}
      </button>
      <span
        className={`flex-1 text-[13px] ${task.done ? "line-through text-gray-300" : "text-gray-700"}`}
      >
        {task.text}
      </span>
      {canPromote && (
        <button
          onClick={onPromote}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-olive hover:text-olive-dark"
          title="Top 3로 승격"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      )}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-danger"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
