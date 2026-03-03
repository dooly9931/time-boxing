"use client";

import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Settings, DEFAULT_SETTINGS } from "@/lib/types";
import { generateTimeBlocks } from "@/lib/timeUtils";

export function useSettings() {
  const [settings, setSettings, loaded] = useLocalStorage<Settings>(
    "tbp_settings",
    DEFAULT_SETTINGS
  );

  const timeBlocks = useMemo(
    () => generateTimeBlocks(settings.dayStart, settings.dayEnd, settings.timeUnit),
    [settings.dayStart, settings.dayEnd, settings.timeUnit]
  );

  return { settings, setSettings, timeBlocks, loaded };
}
