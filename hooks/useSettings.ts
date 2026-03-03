"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Settings, DEFAULT_SETTINGS } from "@/lib/types";
import { generateTimeBlocks } from "@/lib/timeUtils";

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettingsState({
          timeUnit: data.timeUnit ?? DEFAULT_SETTINGS.timeUnit,
          dayStart: data.dayStart ?? DEFAULT_SETTINGS.dayStart,
          dayEnd: data.dayEnd ?? DEFAULT_SETTINGS.dayEnd,
        });
        setLoaded(true);
      });
  }, []);

  const setSettings = useCallback((next: Settings) => {
    setSettingsState(next);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }, []);

  const timeBlocks = useMemo(
    () => generateTimeBlocks(settings.dayStart, settings.dayEnd, settings.timeUnit),
    [settings.dayStart, settings.dayEnd, settings.timeUnit]
  );

  return { settings, setSettings, timeBlocks, loaded };
}
