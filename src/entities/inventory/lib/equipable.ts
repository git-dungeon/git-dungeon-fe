import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { EQUIPMENT_SLOTS } from "@/entities/dashboard/model/types";
import type { InventoryItemSlot } from "@/entities/inventory/model/types";

const EQUIPPABLE_SLOTS = new Set<EquipmentSlot>(EQUIPMENT_SLOTS);

export function isEquippableSlot(
  slot: InventoryItemSlot
): slot is EquipmentSlot {
  return EQUIPPABLE_SLOTS.has(slot as EquipmentSlot);
}
