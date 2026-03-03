"use client";

import SettingsView from "@/components/SettingsView";

export default function SettingsPage() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-warm-white/95 backdrop-blur-sm px-5 py-4">
        <h1 className="text-[15px] font-semibold text-center text-gray-800 tracking-tight">설정</h1>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-sand to-transparent" />
      </div>
      <SettingsView />
    </>
  );
}
