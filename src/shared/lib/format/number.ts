import { getLanguagePreference } from "@/shared/lib/preferences/preferences";

const NUMBER_FORMATTERS = new Map<string, Intl.NumberFormat>();
const NUMBER_LOCALE_MAP: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
};

function resolveNumberFormatter(locale: string) {
  const cached = NUMBER_FORMATTERS.get(locale);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.NumberFormat(locale);
  NUMBER_FORMATTERS.set(locale, formatter);
  return formatter;
}

export function formatNumber(value: number): string {
  const language = getLanguagePreference();
  const locale = NUMBER_LOCALE_MAP[language] ?? "ko-KR";
  return resolveNumberFormatter(locale).format(value);
}
