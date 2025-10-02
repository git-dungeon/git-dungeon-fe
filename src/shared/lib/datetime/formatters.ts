const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("ko-KR", DEFAULT_DATE_OPTIONS);

export function formatDateTime(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "알 수 없음";
  }
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

  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE_IN_MS) {
    return "방금";
  }

  if (absDiff < HOUR_IN_MS) {
    const minutes = Math.round(absDiff / MINUTE_IN_MS);
    const amount = diff < 0 ? minutes : -minutes;
    return RELATIVE_TIME_FORMATTER.format(amount, "minute");
  }

  if (absDiff < DAY_IN_MS) {
    const hours = Math.round(absDiff / HOUR_IN_MS);
    const amount = diff < 0 ? hours : -hours;
    return RELATIVE_TIME_FORMATTER.format(amount, "hour");
  }

  const days = Math.round(absDiff / DAY_IN_MS);
  const amount = diff < 0 ? days : -days;
  return RELATIVE_TIME_FORMATTER.format(amount, "day");
}
