import type {
  EquipmentRarity,
  InventoryModifier,
} from "@/entities/dashboard/model/types";
import { formatStatChange } from "@/shared/lib/stats/format";
import { getLanguagePreference } from "@/shared/lib/preferences/preferences";
import { i18next } from "@/shared/i18n/i18n";

const MODIFIER_LABEL_MAP: Record<
  Extract<InventoryModifier, { kind: "stat" }>["stat"],
  string
> = {
  atk: "ATK",
  def: "DEF",
  hp: "HP",
  maxHp: "MAX HP",
  luck: "LUCK",
};

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

export function formatRarity(rarity: EquipmentRarity): string {
  const key = `inventory.rarity.${rarity}`;
  return i18next.t(key, { defaultValue: rarity });
}

export function formatModifier(modifier: InventoryModifier): string {
  if (modifier.kind === "effect") {
    return `EFFECT ${modifier.effectCode}`;
  }

  if (modifier.stat in MODIFIER_LABEL_MAP) {
    const { text } = formatStatChange(modifier.stat, modifier.value);
    return text;
  }

  const label = modifier.stat.toUpperCase();
  const prefix = modifier.value > 0 ? "+" : "";
  return `${label} ${prefix}${modifier.value}`;
}
