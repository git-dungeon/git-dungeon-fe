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
  effect?: InventoryItemEffect;
  sprite: string;
  obtainedAt: string;
  isEquipped: boolean;
}

export interface InventoryItemEffect {
  type: string;
  description: string;
}

export type InventoryEquippedMap = Record<EquipmentSlot, InventoryItem | null>;

export interface InventoryStatValues {
  hp: number;
  atk: number;
  def: number;
  luck: number;
}

export interface InventorySummary {
  total: InventoryStatValues;
  equipmentBonus: InventoryStatValues;
}

export interface InventoryResponse {
  items: InventoryItem[];
  equipped: InventoryEquippedMap;
  summary: InventorySummary;
}
