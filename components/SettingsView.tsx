"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useTags } from "@/hooks/useTags";
import { Settings } from "@/lib/types";
import { generateHourOptions, formatHourOption } from "@/lib/timeUtils";
import TagBadge from "./TagBadge";

const TIME_UNITS: Settings["timeUnit"][] = [5, 10, 15, 30];
const HOUR_OPTIONS = generateHourOptions();
const TAG_COLORS = ["#8A9A7B", "#5C6B4F", "#C4956A", "#C17B6E", "#7B9A6D", "#D4C9B8"];

export default function SettingsView() {
  const { settings, setSettings, loaded } = useSettings();
  const { tags, createTag, deleteTag, loaded: tagsLoaded } = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  if (!loaded || !tagsLoaded) {
    return <div className="p-12 text-center text-gray-300 text-sm">로딩 중...</div>;
  }

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    createTag(trimmed, newTagColor);
    setNewTagName("");
  };

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

      <div className="h-px bg-gradient-to-r from-transparent via-beige to-transparent" />

      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-3">
          태그 관리
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              onRemove={() => deleteTag(tag.id)}
            />
          ))}
          {tags.length === 0 && (
            <span className="text-[11px] text-gray-300">아직 태그가 없습니다</span>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewTagColor(color)}
                className={`w-6 h-6 rounded-full transition-all ${
                  newTagColor === color ? "ring-2 ring-olive ring-offset-1" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
            placeholder="새 태그"
            className="flex-1 px-3 py-1.5 bg-cream rounded-xl text-[13px] text-gray-700 outline-none"
          />
          <button
            onClick={handleCreateTag}
            className="px-3 py-1.5 bg-olive text-white text-[12px] rounded-xl"
          >
            추가
          </button>
        </div>
      </div>

      <div className="pt-2">
        <div className="h-px bg-gradient-to-r from-transparent via-beige to-transparent mb-4" />
        <p className="text-[11px] text-gray-300 text-center">
          설정은 자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
}
