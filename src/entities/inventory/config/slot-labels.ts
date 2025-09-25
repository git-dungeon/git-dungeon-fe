import type { EquipmentSlot } from "@/entities/dashboard/model/types";

export const INVENTORY_SLOT_LABELS: Record<EquipmentSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
};

export function getInventorySlotLabel(slot: EquipmentSlot): string {
  return INVENTORY_SLOT_LABELS[slot];
}
