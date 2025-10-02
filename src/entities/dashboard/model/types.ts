import type { DungeonAction } from "@/entities/dungeon-log/model/types";

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "ring"];
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

export type EquipmentRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export interface EquipmentModifier {
  stat: "hp" | "atk" | "def" | "luck" | "ap";
  value: number;
}

export interface EquippedItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  modifiers: EquipmentModifier[];
  effect?: {
    type: string;
    description: string;
  };
}

export interface DashboardState {
  userId: string;
  level: number;
  exp: number;
  expToLevel: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  luck: number;
  floor: number;
  maxFloor: number;
  floorProgress: number;
  gold: number;
  ap: number;
  equippedHelmet?: EquippedItem;
  equippedArmor?: EquippedItem;
  equippedWeapon?: EquippedItem;
  equippedRing?: EquippedItem;
  currentAction?: CurrentAction;
  lastActionCompletedAt?: string;
  nextActionStartAt?: string;
}

export interface DashboardResponse {
  state: DashboardState;
}

export interface CurrentAction {
  action: DungeonAction;
  startedAt: string;
}
