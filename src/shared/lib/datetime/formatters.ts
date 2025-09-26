const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("ko-KR", DEFAULT_DATE_OPTIONS);

export function formatDateTime(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return DATE_FORMATTER.format(date);
}

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("ko", {
  numeric: "auto",
});

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export function formatRelativeTime(value: string | number | Date): string {
  const targetTime =
    value instanceof Date ? value.getTime() : new Date(value).getTime();
  const now = Date.now();

  if (Number.isNaN(targetTime)) {
    return "방금";
  }

  const diff = now - targetTime;

  if (diff < MINUTE_IN_MS) {
    return "방금";
  }

  if (diff < HOUR_IN_MS) {
    const minutes = Math.round(diff / MINUTE_IN_MS);
    return RELATIVE_TIME_FORMATTER.format(-minutes, "minute");
  }

  if (diff < DAY_IN_MS) {
    const hours = Math.round(diff / HOUR_IN_MS);
    return RELATIVE_TIME_FORMATTER.format(-hours, "hour");
  }

  const days = Math.round(diff / DAY_IN_MS);
  return RELATIVE_TIME_FORMATTER.format(-days, "day");
}
