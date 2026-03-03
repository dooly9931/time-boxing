import { DayData, Settings, DEFAULT_SETTINGS } from "./types";

const SETTINGS_KEY = "tbp_settings";
const DAY_PREFIX = "tbp_day_";

export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getDayData(date: string): DayData {
  if (typeof window === "undefined") return { date, blocks: {} };
  const raw = localStorage.getItem(DAY_PREFIX + date);
  if (!raw) return { date, blocks: {} };
  return JSON.parse(raw);
}

export function saveDayData(data: DayData): void {
  localStorage.setItem(DAY_PREFIX + data.date, JSON.stringify(data));
}

export function getAllDayKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DAY_PREFIX)) {
      keys.push(key.replace(DAY_PREFIX, ""));
    }
  }
  return keys.sort().reverse();
}
