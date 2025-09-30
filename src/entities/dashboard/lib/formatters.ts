import type {
  EquipmentModifier,
  EquipmentRarity,
} from "@/entities/dashboard/model/types";
import { formatStatChange } from "@/shared/lib/stats/format";

const RARITY_LABEL_MAP: Record<EquipmentRarity, string> = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
};

const MODIFIER_LABEL_MAP: Record<EquipmentModifier["stat"], string> = {
  ap: "AP",
  atk: "ATK",
  def: "DEF",
  hp: "HP",
  luck: "LUCK",
};

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatRarity(rarity: EquipmentRarity): string {
  return RARITY_LABEL_MAP[rarity] ?? rarity;
}

export function formatModifier(modifier: EquipmentModifier): string {
  if (modifier.stat in MODIFIER_LABEL_MAP) {
    const { text } = formatStatChange(modifier.stat, modifier.value);
    return text;
  }

  const label = modifier.stat.toUpperCase();
  const prefix = modifier.value > 0 ? "+" : "";
  return `${label} ${prefix}${modifier.value}`;
}
