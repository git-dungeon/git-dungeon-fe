import type { EquipmentSlot } from "../types";

const SLOT_LABEL_KO: Record<EquipmentSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
};

const SLOT_LABEL_EN: Record<EquipmentSlot, string> = {
  helmet: "Helmet",
  armor: "Armor",
  weapon: "Weapon",
  ring: "Ring",
};

export function getSlotLabel(slot: EquipmentSlot, language: "ko" | "en") {
  return (language === "en" ? SLOT_LABEL_EN : SLOT_LABEL_KO)[slot];
}
