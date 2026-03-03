import { describe, it, expect } from "vitest";
import {
  formatDate,
  parseDate,
  formatKoreanDate,
  formatShortDate,
  addDays,
  isToday,
  isPast,
  today,
} from "@/lib/dateUtils";

describe("formatDate / parseDate", () => {
  it("Date를 YYYY-MM-DD 문자열로 변환", () => {
    expect(formatDate(new Date(2026, 2, 3))).toBe("2026-03-03");
  });

  it("한 자리 월/일에 0 패딩", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("문자열을 Date로 파싱", () => {
    const date = parseDate("2026-03-03");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(3);
  });
});

describe("formatKoreanDate", () => {
  it("한국어 날짜 포맷", () => {
    // 2026-03-03은 화요일
    expect(formatKoreanDate("2026-03-03")).toBe("2026년 3월 3일 (화)");
  });
});

describe("formatShortDate", () => {
  it("짧은 날짜 포맷 (연도 없음)", () => {
    expect(formatShortDate("2026-03-03")).toBe("3월 3일 (화)");
  });
});

describe("addDays", () => {
  it("양수 일 추가", () => {
    expect(addDays("2026-03-03", 1)).toBe("2026-03-04");
  });

  it("음수 일 추가 (이전 날짜)", () => {
    expect(addDays("2026-03-03", -1)).toBe("2026-03-02");
  });

  it("월 경계 처리", () => {
    expect(addDays("2026-03-31", 1)).toBe("2026-04-01");
  });
});

describe("isToday", () => {
  it("오늘 날짜면 true", () => {
    expect(isToday(today())).toBe(true);
  });

  it("다른 날짜면 false", () => {
    expect(isToday("2000-01-01")).toBe(false);
  });
});

describe("isPast", () => {
  it("과거 날짜면 true", () => {
    expect(isPast("2000-01-01")).toBe(true);
  });

  it("오늘이면 false", () => {
    expect(isPast(today())).toBe(false);
  });
});
