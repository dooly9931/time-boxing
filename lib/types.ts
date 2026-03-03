export interface Task {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface DayData {
  date: string;
  blocks: Record<string, Task[]>;
}

export interface Settings {
  timeUnit: 5 | 10 | 15 | 30;
  dayStart: string;
  dayEnd: string;
}

export const DEFAULT_SETTINGS: Settings = {
  timeUnit: 30,
  dayStart: "06:00",
  dayEnd: "23:00",
};
