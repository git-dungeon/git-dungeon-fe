import { z } from "zod";
import type { DungeonAction } from "@/entities/dungeon-log/model/types";

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "ring"] as const;

const EQUIPMENT_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const;

const EQUIPMENT_STATS = ["hp", "atk", "def", "luck", "ap"] as const;

const DUNGEON_ACTIONS = [
  "battle",
  "treasure",
  "empty",
  "rest",
  "trap",
  "move",
  "equip",
  "unequip",
  "discard",
] as const satisfies readonly DungeonAction[];

export const equipmentSlotSchema = z.enum(EQUIPMENT_SLOTS);
export type EquipmentSlot = z.infer<typeof equipmentSlotSchema>;

export const equipmentRaritySchema = z.enum(EQUIPMENT_RARITIES);
export type EquipmentRarity = z.infer<typeof equipmentRaritySchema>;

const equipmentStatSchema = z.enum(EQUIPMENT_STATS);

export const equipmentModifierSchema = z.object({
  stat: equipmentStatSchema,
  value: z.number(),
});
export type EquipmentModifier = z.infer<typeof equipmentModifierSchema>;

const equipmentEffectSchema = z.object({
  type: z.string(),
  description: z.string(),
});

export const equippedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: equipmentSlotSchema,
  rarity: equipmentRaritySchema,
  modifiers: z.array(equipmentModifierSchema),
  effect: equipmentEffectSchema.optional(),
});
export type EquippedItem = z.infer<typeof equippedItemSchema>;

const currentActionSchema = z.object({
  action: z.enum(DUNGEON_ACTIONS),
  startedAt: z.string(),
});
export type CurrentAction = z.infer<typeof currentActionSchema>;

export const dashboardStateSchema = z.object({
  userId: z.string(),
  level: z.number(),
  exp: z.number(),
  expToLevel: z.number(),
  hp: z.number(),
  maxHp: z.number(),
  atk: z.number(),
  def: z.number(),
  luck: z.number(),
  floor: z.number(),
  maxFloor: z.number(),
  floorProgress: z.number(),
  gold: z.number(),
  ap: z.number(),
  equippedHelmet: equippedItemSchema.optional(),
  equippedArmor: equippedItemSchema.optional(),
  equippedWeapon: equippedItemSchema.optional(),
  equippedRing: equippedItemSchema.optional(),
  currentAction: currentActionSchema.optional(),
  lastActionCompletedAt: z.string().optional(),
  nextActionStartAt: z.string().optional(),
});
export type DashboardState = z.infer<typeof dashboardStateSchema>;

export const dashboardResponseSchema = z.object({
  state: dashboardStateSchema,
});
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
