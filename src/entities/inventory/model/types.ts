import type {
  EquipmentModifier,
  EquipmentRarity,
  EquipmentSlot,
} from "@/entities/dashboard/model/types";

export interface InventoryItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  modifiers: EquipmentModifier[];
  obtainedAt: string;
  isEquipped: boolean;
}

export interface InventoryResponse {
  items: InventoryItem[];
}
