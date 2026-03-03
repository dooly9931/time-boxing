"use client";

import { useIncomplete } from "@/hooks/useIncomplete";
import { formatShortDate } from "@/lib/dateUtils";

interface Props {
  onNavigate: (date: string) => void;
}

export default function IncompleteView({ onNavigate }: Props) {
  const { groups, loaded } = useIncomplete();

  if (!loaded) {
    return <div className="p-8 text-center text-gray-400">로딩 중...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-gray-500">미완료 작업이 없습니다!</p>
      </div>
    );
  }

  const totalCount = groups.reduce((sum, g) => sum + g.tasks.length, 0);

  return (
    <div className="px-4 py-2">
      <p className="text-xs text-gray-400 mb-3">총 {totalCount}개의 미완료 작업</p>
      {groups.map((group) => (
        <div key={group.date} className="mb-4">
          <button
            onClick={() => onNavigate(group.date)}
            className="text-sm font-medium text-gray-700 mb-1 hover:text-primary transition-colors"
          >
            {formatShortDate(group.date)} →
          </button>
          <div className="space-y-1">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 py-1.5 px-3 bg-white rounded-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1">{task.text}</span>
                <span className="text-xs text-gray-400">{task.blockTime}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
