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
      className={`flex border-t ${
        isCurrent ? "border-l-3 border-l-primary bg-primary-light/30" : "border-l-3 border-l-transparent"
      } ${isHour ? "border-t-gray-200" : "border-t-gray-100"}`}
    >
      <div className={`w-16 flex-shrink-0 pt-2 pr-2 text-right ${
        isHour ? "text-xs font-medium text-gray-700" : "text-xs text-gray-400"
      }`}>
        {isHour ? `${h}:${m}` : `:${m}`}
      </div>
      <div className="flex-1 py-1 pl-2 min-h-[2.5rem]">
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
