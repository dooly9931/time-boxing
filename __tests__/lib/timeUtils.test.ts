import { describe, it, expect } from "vitest";
import {
  generateTimeBlocks,
  getCurrentTimeBlock,
  formatTimeLabel,
  generateHourOptions,
  formatHourOption,
} from "@/lib/timeUtils";

describe("generateTimeBlocks", () => {
  it("30분 단위로 블록 생성", () => {
    const blocks = generateTimeBlocks("06:00", "08:00", 30);
    expect(blocks).toEqual(["06:00", "06:30", "07:00", "07:30"]);
  });

  it("5분 단위로 블록 생성", () => {
    const blocks = generateTimeBlocks("09:00", "09:30", 5);
    expect(blocks).toEqual(["09:00", "09:05", "09:10", "09:15", "09:20", "09:25"]);
  });

  it("15분 단위로 블록 생성", () => {
    const blocks = generateTimeBlocks("12:00", "13:00", 15);
    expect(blocks).toEqual(["12:00", "12:15", "12:30", "12:45"]);
  });

  it("시작과 종료가 같으면 빈 배열", () => {
    expect(generateTimeBlocks("06:00", "06:00", 30)).toEqual([]);
  });

  it("종료 시간 블록은 포함하지 않음", () => {
    const blocks = generateTimeBlocks("22:00", "23:00", 30);
    expect(blocks).toEqual(["22:00", "22:30"]);
    expect(blocks).not.toContain("23:00");
  });
});

describe("getCurrentTimeBlock", () => {
  it("현재 시각에 해당하는 블록 반환", () => {
    const blocks = ["09:00", "09:30", "10:00", "10:30"];
    // 09:15에 대해 09:00 블록 반환
    const now = new Date();
    now.setHours(9, 15, 0, 0);
    const originalDate = globalThis.Date;
    globalThis.Date = class extends originalDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) return new originalDate(now.getTime()) as unknown as Date;
        // @ts-expect-error: spread for Date constructor
        return new originalDate(...args) as unknown as Date;
      }
    } as unknown as typeof Date;

    expect(getCurrentTimeBlock(blocks, 30)).toBe("09:00");
    globalThis.Date = originalDate;
  });

  it("블록 범위 밖이면 null", () => {
    const blocks = ["09:00", "09:30"];
    const now = new Date();
    now.setHours(8, 0, 0, 0);
    const originalDate = globalThis.Date;
    globalThis.Date = class extends originalDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) return new originalDate(now.getTime()) as unknown as Date;
        // @ts-expect-error: spread for Date constructor
        return new originalDate(...args) as unknown as Date;
      }
    } as unknown as typeof Date;

    expect(getCurrentTimeBlock(blocks, 30)).toBeNull();
    globalThis.Date = originalDate;
  });
});

describe("formatTimeLabel", () => {
  it("오전 시간 표시", () => {
    expect(formatTimeLabel("06:00")).toBe("오전 6");
    expect(formatTimeLabel("11:30")).toBe("오전 11");
  });

  it("오후 시간 표시", () => {
    expect(formatTimeLabel("13:00")).toBe("오후 1");
    expect(formatTimeLabel("23:00")).toBe("오후 11");
  });

  it("정오 표시", () => {
    expect(formatTimeLabel("12:00")).toBe("오후 12");
  });

  it("자정 표시", () => {
    expect(formatTimeLabel("00:00")).toBe("오전 12");
  });
});

describe("generateHourOptions", () => {
  it("24개 옵션 생성", () => {
    const options = generateHourOptions();
    expect(options).toHaveLength(24);
    expect(options[0]).toBe("00:00");
    expect(options[23]).toBe("23:00");
  });
});

describe("formatHourOption", () => {
  it("자정", () => {
    expect(formatHourOption("00:00")).toBe("자정 (00:00)");
  });
  it("정오", () => {
    expect(formatHourOption("12:00")).toBe("정오 (12:00)");
  });
  it("오전", () => {
    expect(formatHourOption("06:00")).toBe("오전 6시 (06:00)");
  });
  it("오후", () => {
    expect(formatHourOption("15:00")).toBe("오후 3시 (15:00)");
  });
});
