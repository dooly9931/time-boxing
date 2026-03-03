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
      className="flex items-center gap-2.5 py-1 group"
      onClick={() => setShowDelete(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${
          task.done
            ? "bg-olive border-olive"
            : "border-sand hover:border-olive-light"
        }`}
      >
        {task.done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-[13px] leading-snug transition-colors ${
          task.done ? "line-through text-gray-300" : "text-gray-700"
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
          className="text-[11px] text-danger px-2 py-0.5 rounded-full bg-danger/10 flex-shrink-0 transition-colors hover:bg-danger/20"
        >
          삭제
        </button>
      )}
    </div>
  );
}
