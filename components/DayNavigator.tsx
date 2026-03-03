"use client";

import { formatKoreanDate, isToday } from "@/lib/dateUtils";
import { useStreak } from "@/hooks/useStreak";

interface Props {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function DayNavigator({ date, onPrev, onNext, onToday }: Props) {
  const { streak, loaded: streakLoaded } = useStreak();
  const showStreak = isToday(date) && streakLoaded;

  return (
    <div className="sticky top-0 z-10 bg-warm-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={onPrev}
          className="p-2 -ml-2 text-gray-400 hover:text-olive-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">
            {formatKoreanDate(date)}
          </h1>
          {showStreak && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {streak.currentStreak > 0 && (
                <span className="text-[10px] text-gray-400">
                  연속 {streak.currentStreak}일
                </span>
              )}
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i <= streak.todayStars ? "text-accent" : "text-beige"}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
          {!isToday(date) && (
            <button
              onClick={onToday}
              className="text-[11px] text-olive mt-0.5 hover:text-olive-dark transition-colors"
            >
              오늘로 이동
            </button>
          )}
        </div>
        <button
          onClick={onNext}
          className="p-2 -mr-2 text-gray-400 hover:text-olive-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-sand to-transparent" />
    </div>
  );
}
