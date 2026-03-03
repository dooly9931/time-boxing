"use client";

import { useState } from "react";
import { Task } from "@/lib/types";

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="flex items-center gap-2 py-1 group"
      onClick={() => setShowDelete(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.done
            ? "bg-success border-success"
            : "border-gray-300"
        }`}
      >
        {task.done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm ${
          task.done ? "line-through text-gray-400" : "text-gray-900"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setShowDelete(!showDelete);
        }}
      >
        {task.text}
      </span>
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-xs text-danger px-2 py-1 rounded bg-red-50 flex-shrink-0"
        >
          삭제
        </button>
      )}
    </div>
  );
}
