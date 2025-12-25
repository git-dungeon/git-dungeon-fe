import type { InventoryItemSlot } from "@/entities/inventory/model/types";

export const INVENTORY_SLOT_LABELS: Record<InventoryItemSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
  consumable: "소모품",
};

export function getInventorySlotLabel(slot: InventoryItemSlot): string {
  return INVENTORY_SLOT_LABELS[slot];
}
