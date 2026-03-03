"use client";

import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

interface Props {
  time: string;
  tasks: Task[];
  isCurrent: boolean;
  isHour: boolean;
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TimeBlock({
  time,
  tasks,
  isCurrent,
  isHour,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: Props) {
  const [h, m] = time.split(":");

  return (
    <div
      className={`flex transition-colors ${
        isCurrent
          ? "bg-cream/60 border-l-2 border-l-olive"
          : "border-l-2 border-l-transparent"
      } ${isHour ? "border-t border-t-beige" : ""}`}
    >
      <div className={`w-14 flex-shrink-0 pt-2.5 pr-3 text-right ${
        isHour
          ? "text-[11px] font-medium text-gray-600"
          : "text-[11px] text-gray-300"
      }`}>
        {isHour ? `${h}:${m}` : `:${m}`}
      </div>
      <div className="flex-1 py-1.5 pl-3 min-h-[2.5rem] border-l border-l-gray-100">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
        <TaskInput onAdd={onAddTask} />
      </div>
    </div>
  );
}
