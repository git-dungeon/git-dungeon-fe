import type { InventoryItemSlot } from "@/entities/inventory/model/types";
import { i18next } from "@/shared/i18n/i18n";

export function getInventorySlotLabel(slot: InventoryItemSlot): string {
  const key = `inventory.slots.labels.${slot}`;
  const value = i18next.t(key);
  return value === key ? slot : value;
}
