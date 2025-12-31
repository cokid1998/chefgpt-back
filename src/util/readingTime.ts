// src/common/utils/reading-time.util.ts
import readingTime from "reading-time";
import { htmlToText } from "html-to-text";

export function getReadingTimeFromHTML(html: string): number {
  const text = htmlToText(html, {
    wordwrap: false,
  });

  const stats = readingTime(text);

  return Math.max(1, Math.ceil(stats.minutes));
}
