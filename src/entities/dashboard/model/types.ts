import type { DungeonAction } from "@/entities/dungeon-log/model/types";

export type EquipmentSlot = "weapon" | "armor";

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
  equippedWeapon?: EquippedItem;
  equippedArmor?: EquippedItem;
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
