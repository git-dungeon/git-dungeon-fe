import type {
  EquipmentModifier,
  EquipmentRarity,
} from "@/entities/dashboard/model/types";

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
  const label =
    MODIFIER_LABEL_MAP[modifier.stat] ?? modifier.stat.toUpperCase();
  const valuePrefix = modifier.value > 0 ? "+" : "";
  return `${label} ${valuePrefix}${modifier.value}`;
}
