"use client";

import { formatKoreanDate, isToday } from "@/lib/dateUtils";

interface Props {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function DayNavigator({ date, onPrev, onNext, onToday }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onPrev}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold">{formatKoreanDate(date)}</h1>
          {!isToday(date) && (
            <button
              onClick={onToday}
              className="text-xs text-primary mt-0.5"
            >
              오늘로 이동
            </button>
          )}
        </div>
        <button
          onClick={onNext}
          className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
