"use client";

import { useRouter } from "next/navigation";
import IncompleteView from "@/components/IncompleteView";

export default function IncompletePage() {
  const router = useRouter();

  return (
    <>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <h1 className="text-base font-semibold text-center">미완료 작업</h1>
      </div>
      <IncompleteView
        onNavigate={(date) => {
          router.push(`/?date=${date}`);
        }}
      />
    </>
  );
}
