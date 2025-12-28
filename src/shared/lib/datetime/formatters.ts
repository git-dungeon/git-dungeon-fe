import { getLanguagePreference } from "@/shared/lib/preferences/preferences";
import { i18next } from "@/shared/i18n/i18n";

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

const DATE_LOCALE_MAP: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
};

const RELATIVE_LOCALE_MAP: Record<string, string> = {
  ko: "ko",
  en: "en",
};

const DATE_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const RELATIVE_TIME_FORMATTERS = new Map<string, Intl.RelativeTimeFormat>();

function resolveLanguage(): string {
  return getLanguagePreference();
}

function resolveDateFormatter(locale: string) {
  const cached = DATE_FORMATTERS.get(locale);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.DateTimeFormat(locale, DEFAULT_DATE_OPTIONS);
  DATE_FORMATTERS.set(locale, formatter);
  return formatter;
}

function resolveRelativeFormatter(locale: string) {
  const cached = RELATIVE_TIME_FORMATTERS.get(locale);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });
  RELATIVE_TIME_FORMATTERS.set(locale, formatter);
  return formatter;
}

function resolveLocaleString(map: Record<string, string>, fallback: string) {
  const language = resolveLanguage();
  return map[language] ?? fallback;
}

export function formatDateTime(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const unknown = i18next.t("datetime.unknown");
    return unknown === "datetime.unknown" ? "알 수 없음" : unknown;
  }
  const locale = resolveLocaleString(DATE_LOCALE_MAP, "ko-KR");
  return resolveDateFormatter(locale).format(date);
}

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export function formatRelativeTime(value: string | number | Date): string {
  const targetTime =
    value instanceof Date ? value.getTime() : new Date(value).getTime();
  const now = Date.now();

  if (Number.isNaN(targetTime)) {
    const justNow = i18next.t("datetime.justNow");
    return justNow === "datetime.justNow" ? "방금" : justNow;
  }

  const diff = now - targetTime;

  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE_IN_MS) {
    const justNow = i18next.t("datetime.justNow");
    return justNow === "datetime.justNow" ? "방금" : justNow;
  }

  const relativeLocale = resolveLocaleString(RELATIVE_LOCALE_MAP, "ko");
  const formatter = resolveRelativeFormatter(relativeLocale);

  if (absDiff < HOUR_IN_MS) {
    const minutes = Math.round(absDiff / MINUTE_IN_MS);
    const amount = diff < 0 ? minutes : -minutes;
    return formatter.format(amount, "minute");
  }

  if (absDiff < DAY_IN_MS) {
    const hours = Math.round(absDiff / HOUR_IN_MS);
    const amount = diff < 0 ? hours : -hours;
    return formatter.format(amount, "hour");
  }

  const days = Math.round(absDiff / DAY_IN_MS);
  const amount = diff < 0 ? days : -days;
  return formatter.format(amount, "day");
}
