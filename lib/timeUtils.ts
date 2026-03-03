export function generateTimeBlocks(
  dayStart: string,
  dayEnd: string,
  timeUnit: number
): string[] {
  const blocks: string[] = [];
  const [startH, startM] = dayStart.split(":").map(Number);
  const [endH, endM] = dayEnd.split(":").map(Number);

  let totalMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (totalMinutes < endMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    blocks.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    totalMinutes += timeUnit;
  }

  return blocks;
}

export function getCurrentTimeBlock(
  blocks: string[],
  timeUnit: number
): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = blocks.length - 1; i >= 0; i--) {
    const [h, m] = blocks[i].split(":").map(Number);
    const blockMinutes = h * 60 + m;
    if (currentMinutes >= blockMinutes && currentMinutes < blockMinutes + timeUnit) {
      return blocks[i];
    }
  }
  return null;
}

export function formatTimeLabel(time: string): string {
  const [h] = time.split(":").map(Number);
  const period = h < 12 ? "오전" : "오후";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${period} ${displayH}`;
}

export function generateHourOptions(): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    options.push(`${String(h).padStart(2, "0")}:00`);
  }
  return options;
}

export function formatHourOption(time: string): string {
  const [h] = time.split(":").map(Number);
  if (h === 0) return "자정 (00:00)";
  if (h === 12) return "정오 (12:00)";
  const period = h < 12 ? "오전" : "오후";
  const displayH = h > 12 ? h - 12 : h;
  return `${period} ${displayH}시 (${time})`;
}
