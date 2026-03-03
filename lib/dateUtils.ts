const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function today(): string {
  return formatDate(new Date());
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatKoreanDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = DAYS[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

export function formatShortDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = DAYS[date.getDay()];
  return `${m}월 ${d}일 (${day})`;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function isToday(dateStr: string): boolean {
  return dateStr === today();
}

export function isPast(dateStr: string): boolean {
  return dateStr < today();
}
