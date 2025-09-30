import { subMinutes } from "date-fns";

const MOCK_TIME_BASE = new Date("2024-05-26T12:00:00Z");

export function mockTimestampMinutesAgo(minutesAgo: number): string {
  if (!Number.isFinite(minutesAgo)) {
    return MOCK_TIME_BASE.toISOString();
  }
  return subMinutes(MOCK_TIME_BASE, minutesAgo).toISOString();
}

export type TimestampSource = Date | string;

export function toMockTimestamp(source: TimestampSource): string {
  if (source instanceof Date) {
    return source.toISOString();
  }
  return new Date(source).toISOString();
}

export const MOCK_TIME_BASE_ISO = MOCK_TIME_BASE.toISOString();
