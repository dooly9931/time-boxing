"use client";

import SettingsView from "@/components/SettingsView";

export default function SettingsPage() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <h1 className="text-base font-semibold text-center">설정</h1>
      </div>
      <SettingsView />
    </>
  );
}
