"use client";

import { useSettings } from "@/hooks/useSettings";
import { Settings } from "@/lib/types";
import { generateHourOptions, formatHourOption } from "@/lib/timeUtils";

const TIME_UNITS: Settings["timeUnit"][] = [5, 10, 15, 30];
const HOUR_OPTIONS = generateHourOptions();

export default function SettingsView() {
  const { settings, setSettings, loaded } = useSettings();

  if (!loaded) {
    return <div className="p-12 text-center text-gray-300 text-sm">로딩 중...</div>;
  }

  return (
    <div className="px-5 py-5 space-y-7">
      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-3">
          시간 단위
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_UNITS.map((unit) => (
            <button
              key={unit}
              onClick={() => setSettings({ ...settings, timeUnit: unit })}
              className={`py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                settings.timeUnit === unit
                  ? "bg-olive text-white shadow-sm"
                  : "bg-cream text-gray-500 hover:bg-beige"
              }`}
            >
              {unit}분
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-3">
          하루 시작 시간
        </label>
        <select
          value={settings.dayStart}
          onChange={(e) =>
            setSettings({ ...settings, dayStart: e.target.value })
          }
          className="w-full p-3 bg-cream rounded-xl text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-olive/30 transition-shadow"
        >
          {HOUR_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {formatHourOption(opt)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-3">
          하루 종료 시간
        </label>
        <select
          value={settings.dayEnd}
          onChange={(e) =>
            setSettings({ ...settings, dayEnd: e.target.value })
          }
          className="w-full p-3 bg-cream rounded-xl text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-olive/30 transition-shadow"
        >
          {HOUR_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {formatHourOption(opt)}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-5">
        <div className="h-px bg-gradient-to-r from-transparent via-beige to-transparent mb-4" />
        <p className="text-[11px] text-gray-300 text-center">
          설정은 자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
}
