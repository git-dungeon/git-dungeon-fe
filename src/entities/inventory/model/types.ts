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
  sprite: string;
  obtainedAt: string;
  isEquipped: boolean;
}

export type InventoryEquippedMap = Record<EquipmentSlot, InventoryItem | null>;

export interface InventorySummary {
  hp: number;
  atk: number;
  def: number;
  luck: number;
}

export interface InventoryResponse {
  items: InventoryItem[];
  equipped: InventoryEquippedMap;
  summary: InventorySummary;
}
