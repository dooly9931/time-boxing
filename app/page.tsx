"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { today, addDays } from "@/lib/dateUtils";
import DayNavigator from "@/components/DayNavigator";
import DayView from "@/components/DayView";

function HomeContent() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") || today();
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    const param = searchParams.get("date");
    if (param) setDate(param);
  }, [searchParams]);

  return (
    <>
      <DayNavigator
        date={date}
        onPrev={() => setDate((d) => addDays(d, -1))}
        onNext={() => setDate((d) => addDays(d, 1))}
        onToday={() => setDate(today())}
      />
      <DayView key={date} date={date} />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">로딩 중...</div>}>
      <HomeContent />
    </Suspense>
  );
}
