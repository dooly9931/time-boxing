"use client";

import { useSettings } from "@/hooks/useSettings";
import { Settings } from "@/lib/types";
import { generateHourOptions, formatHourOption } from "@/lib/timeUtils";

const TIME_UNITS: Settings["timeUnit"][] = [5, 10, 15, 30];
const HOUR_OPTIONS = generateHourOptions();

export default function SettingsView() {
  const { settings, setSettings, loaded } = useSettings();

  if (!loaded) {
    return <div className="p-8 text-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="px-4 py-4 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          시간 단위
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_UNITS.map((unit) => (
            <button
              key={unit}
              onClick={() => setSettings({ ...settings, timeUnit: unit })}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.timeUnit === unit
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {unit}분
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          하루 시작 시간
        </label>
        <select
          value={settings.dayStart}
          onChange={(e) =>
            setSettings({ ...settings, dayStart: e.target.value })
          }
          className="w-full p-2.5 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {HOUR_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {formatHourOption(opt)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          하루 종료 시간
        </label>
        <select
          value={settings.dayEnd}
          onChange={(e) =>
            setSettings({ ...settings, dayEnd: e.target.value })
          }
          className="w-full p-2.5 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {HOUR_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {formatHourOption(opt)}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          설정은 자동으로 저장됩니다.
        </p>
      </div>
    </div>
  );
}
