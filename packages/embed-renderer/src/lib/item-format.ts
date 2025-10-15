import type {
  EquipmentModifier,
  EquipmentRarity,
  InventoryItemEffect,
} from "../types";
import { formatStatChange } from "./stat-format";

const RARITY_LABEL_KO: Record<EquipmentRarity, string> = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
};

const RARITY_LABEL_EN: Record<EquipmentRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const INVENTORY_EFFECT_LABEL_EN: Record<string, string> = {
  resurrection: "Resurrection",
};

const INVENTORY_EFFECT_LABEL_KO: Record<string, string> = {
  resurrection: "부활",
};

export function formatRarity(rarity: EquipmentRarity, language: "ko" | "en") {
  const labels = language === "en" ? RARITY_LABEL_EN : RARITY_LABEL_KO;
  return labels[rarity] ?? rarity;
}

export function formatInventoryEffect(
  effect: InventoryItemEffect,
  language: "ko" | "en"
): string {
  const labels =
    language === "en"
      ? INVENTORY_EFFECT_LABEL_EN
      : INVENTORY_EFFECT_LABEL_KO;
  return labels[effect.type] ?? effect.type;
}

export function formatModifierSummary(
  modifier: EquipmentModifier,
  language: "ko" | "en"
) {
  const { text, tone } = formatStatChange(modifier.stat, modifier.value);
  const localizedText =
    language === "en"
      ? text.replace("HP", "HP")
      : text.replace("HP", "HP");
  return {
    text: localizedText,
    tone,
  };
}

export function formatLocaleNumber(value: number, language: "ko" | "en") {
  const locale = language === "en" ? "en-US" : "ko-KR";
  return new Intl.NumberFormat(locale).format(value);
}
