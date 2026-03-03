"use client";

import { useIncomplete } from "@/hooks/useIncomplete";
import { formatShortDate } from "@/lib/dateUtils";

interface Props {
  onNavigate: (date: string) => void;
}

export default function IncompleteView({ onNavigate }: Props) {
  const { groups, loaded } = useIncomplete();

  if (!loaded) {
    return <div className="p-12 text-center text-gray-300 text-sm">로딩 중...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
          <svg className="w-7 h-7 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">미완료 작업이 없습니다</p>
        <p className="text-[11px] text-gray-300 mt-1">모든 작업을 완료했어요!</p>
      </div>
    );
  }

  const totalCount = groups.reduce((sum, g) => sum + g.tasks.length, 0);

  return (
    <div className="px-5 py-3">
      <p className="text-[11px] text-gray-400 mb-4">{totalCount}개의 미완료 작업</p>
      {groups.map((group) => (
        <div key={group.date} className="mb-5">
          <button
            onClick={() => onNavigate(group.date)}
            className="text-[13px] font-medium text-gray-600 mb-2 flex items-center gap-1 hover:text-olive-dark transition-colors"
          >
            {formatShortDate(group.date)}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="space-y-1.5">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-2 px-3.5 bg-cream/50 rounded-xl"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-[13px] text-gray-700 flex-1">{task.text}</span>
                <span className="text-[11px] text-gray-400 font-mono">{task.blockTime}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
