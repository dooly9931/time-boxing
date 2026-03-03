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

export interface ApiTask {
  id: string;
  date: string;
  blockTime: string | null;
  text: string;
  done: boolean;
  category: "braindump" | "top3" | "timeboxed";
  priority: number | null;
  createdAt: string;
  tags?: { tagId: string; tag: Tag }[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todayStars: number;
}
