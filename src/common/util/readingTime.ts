// src/common/utils/reading-time.util.ts
import readingTime from "reading-time";

export function getReadingTimeFromText(text: string) {
  const stats = readingTime(text);

  return Math.max(1, Math.ceil(stats.minutes));
}
