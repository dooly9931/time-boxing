import { describe, it, expect, beforeEach } from "vitest";
import {
  getSettings,
  saveSettings,
  getDayData,
  saveDayData,
  getAllDayKeys,
} from "@/lib/storage";
import { DEFAULT_SETTINGS } from "@/lib/types";

beforeEach(() => {
  localStorage.clear();
});

describe("settings", () => {
  it("저장된 설정이 없으면 기본값 반환", () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("설정 저장 및 읽기", () => {
    const custom = { timeUnit: 15 as const, dayStart: "07:00", dayEnd: "22:00" };
    saveSettings(custom);
    expect(getSettings()).toEqual(custom);
  });
});

describe("dayData", () => {
  it("저장된 데이터 없으면 빈 블록 반환", () => {
    const data = getDayData("2026-03-03");
    expect(data).toEqual({ date: "2026-03-03", blocks: {} });
  });

  it("일별 데이터 저장 및 읽기", () => {
    const data = {
      date: "2026-03-03",
      blocks: {
        "09:00": [
          { id: "abc", text: "테스트", done: false, createdAt: "2026-03-03T00:00:00Z" },
        ],
      },
    };
    saveDayData(data);
    expect(getDayData("2026-03-03")).toEqual(data);
  });
});

describe("getAllDayKeys", () => {
  it("저장된 날짜 키를 역순으로 반환", () => {
    saveDayData({ date: "2026-03-01", blocks: {} });
    saveDayData({ date: "2026-03-03", blocks: {} });
    saveDayData({ date: "2026-03-02", blocks: {} });

    const keys = getAllDayKeys();
    expect(keys).toEqual(["2026-03-03", "2026-03-02", "2026-03-01"]);
  });

  it("설정 키는 포함하지 않음", () => {
    saveSettings(DEFAULT_SETTINGS);
    saveDayData({ date: "2026-03-01", blocks: {} });

    const keys = getAllDayKeys();
    expect(keys).toEqual(["2026-03-01"]);
  });
});
