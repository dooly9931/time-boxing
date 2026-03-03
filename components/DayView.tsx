"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useDayData } from "@/hooks/useDayData";
import { getCurrentTimeBlock } from "@/lib/timeUtils";
import { isToday } from "@/lib/dateUtils";
import TimeBlock from "./TimeBlock";

interface Props {
  date: string;
}

export default function DayView({ date }: Props) {
  const { settings, timeBlocks } = useSettings();
  const { dayData, addTask, toggleTask, deleteTask, loaded } = useDayData(date);
  const currentBlockRef = useRef<HTMLDivElement>(null);

  const currentBlock = isToday(date)
    ? getCurrentTimeBlock(timeBlocks, settings.timeUnit)
    : null;

  useEffect(() => {
    if (loaded && currentBlockRef.current) {
      currentBlockRef.current.scrollIntoView({ block: "center" });
    }
  }, [loaded, date]);

  if (!loaded) {
    return (
      <div className="p-12 text-center text-gray-300 text-sm">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="px-3 pt-1">
      {timeBlocks.map((time) => {
        const isCurrent = time === currentBlock;
        const isHour = time.endsWith(":00");
        return (
          <div key={time} ref={isCurrent ? currentBlockRef : undefined}>
            <TimeBlock
              time={time}
              tasks={dayData.blocks[time] || []}
              isCurrent={isCurrent}
              isHour={isHour}
              onAddTask={(text) => addTask(time, text)}
              onToggleTask={(taskId) => toggleTask(time, taskId)}
              onDeleteTask={(taskId) => deleteTask(time, taskId)}
            />
          </div>
        );
      })}
    </div>
  );
}
