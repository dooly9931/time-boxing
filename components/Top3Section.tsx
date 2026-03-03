"use client";

import { useState } from "react";
import { ApiTask } from "@/lib/types";

interface Props {
  tasks: ApiTask[];
  onAdd: (text: string, priority: number) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDemote: (taskId: string) => void;
}

export default function Top3Section({ tasks, onAdd, onToggle, onDelete, onDemote }: Props) {
  const starsEarned = tasks.filter((t) => t.done).length;

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[13px] font-medium text-olive">오늘의 Top 3</h2>
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i <= starsEarned ? "text-accent" : "text-beige"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="bg-cream/40 rounded-xl p-3 space-y-1">
        {[1, 2, 3].map((priority) => {
          const task = tasks.find((t) => t.priority === priority);
          return task ? (
            <Top3Item
              key={task.id}
              task={task}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
              onDemote={() => onDemote(task.id)}
            />
          ) : (
            <Top3Slot key={priority} priority={priority} onAdd={onAdd} />
          );
        })}
      </div>
    </div>
  );
}

function Top3Item({
  task,
  onToggle,
  onDelete,
  onDemote,
}: {
  task: ApiTask;
  onToggle: () => void;
  onDelete: () => void;
  onDemote: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 group">
      <button onClick={onToggle} className="flex-shrink-0">
        <svg
          className={`w-[18px] h-[18px] ${task.done ? "text-accent" : "text-beige"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
      <span
        className={`flex-1 text-[13px] ${task.done ? "line-through text-gray-300" : "text-gray-700 font-medium"}`}
      >
        {task.text}
      </span>
      <button
        onClick={onDemote}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
        title="Brain Dump로 이동"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
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

function Top3Slot({
  priority,
  onAdd,
}: {
  priority: number;
  onAdd: (text: string, priority: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed, priority);
    }
    setText("");
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 py-1.5 w-full text-left"
      >
        <svg className="w-[18px] h-[18px] text-beige" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <span className="text-[13px] text-gray-300">여기에 추가</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <svg className="w-[18px] h-[18px] text-beige flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="할 일 입력..."
        className="flex-1 text-[13px] text-gray-700 bg-transparent outline-none"
      />
    </div>
  );
}
