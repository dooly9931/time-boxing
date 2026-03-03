"use client";

import { ApiTask } from "@/lib/types";
import TaskInput from "./TaskInput";

interface Props {
  tasks: ApiTask[];
  onAdd: (text: string) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onPromote: (taskId: string, priority: number) => void;
  top3Count: number;
}

export default function BrainDumpSection({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  onPromote,
  top3Count,
}: Props) {
  const canPromote = top3Count < 3;

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[13px] font-medium text-olive">Brain Dump</h2>
        <span className="text-[11px] text-gray-300">생각나는 것 모두 적어보세요</span>
      </div>
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
