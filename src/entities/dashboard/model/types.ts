import { z } from "zod";

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "ring"] as const;
const EQUIPMENT_ITEM_SLOTS = [...EQUIPMENT_SLOTS, "consumable"] as const;

const EQUIPMENT_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const;

export const equipmentSlotSchema = z.enum(EQUIPMENT_SLOTS);
export type EquipmentSlot = z.infer<typeof equipmentSlotSchema>;

export const equipmentItemSlotSchema = z.enum(EQUIPMENT_ITEM_SLOTS);
export type EquipmentItemSlot = z.infer<typeof equipmentItemSlotSchema>;

export const equipmentRaritySchema = z.enum(EQUIPMENT_RARITIES);
export type EquipmentRarity = z.infer<typeof equipmentRaritySchema>;

const inventoryStatSchema = z.enum(["hp", "atk", "def", "luck"]);
const inventoryModifierModeSchema = z.enum(["flat", "percent"]);

const equipmentStatBlockSchema = z
  .object({
    hp: z.number(),
    maxHp: z.number(),
    atk: z.number(),
    def: z.number(),
    luck: z.number(),
  })
  .strict();

const equipmentStatSummarySchema = z
  .object({
    base: equipmentStatBlockSchema,
    equipmentBonus: equipmentStatBlockSchema,
    total: equipmentStatBlockSchema,
  })
  .strict();

export const inventoryModifierStatSchema = z.object({
  kind: z.literal("stat"),
  stat: inventoryStatSchema,
  mode: inventoryModifierModeSchema,
  value: z.number(),
});

export const inventoryModifierEffectSchema = z.object({
  kind: z.literal("effect"),
  effectCode: z.string(),
  params: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const inventoryModifierSchema = z.union([
  inventoryModifierStatSchema,
  inventoryModifierEffectSchema,
]);
export type InventoryModifier = z.infer<typeof inventoryModifierSchema>;

export const equipmentItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().nullable().optional(),
  slot: equipmentItemSlotSchema,
  rarity: equipmentRaritySchema,
  modifiers: z.array(inventoryModifierSchema),
  effect: z.string().nullable().optional(),
  sprite: z.string().nullable().optional(),
  createdAt: z.string(),
  isEquipped: z.boolean(),
  version: z.number(),
});
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;

export const dashboardCurrentActionSchema = z.enum([
  "IDLE",
  "EXPLORING",
  "BATTLE",
  "REST",
  "TREASURE",
  "TRAP",
]);
export type DashboardCurrentAction = z.infer<
  typeof dashboardCurrentActionSchema
>;

export const dashboardStateSchema = z.object({
  userId: z.string(),
  level: z.number(),
  exp: z.number(),
  expToLevel: z.number().nullable().optional(),
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
  currentAction: dashboardCurrentActionSchema,
  currentActionStartedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number(),
  stats: equipmentStatSummarySchema,
  equippedItems: z.array(equipmentItemSchema),
  lastActionCompletedAt: z.string().optional(),
  nextActionStartAt: z.string().optional(),
});
export type DashboardState = z.infer<typeof dashboardStateSchema>;

export const dashboardResponseSchema = z.object({
  state: dashboardStateSchema,
});
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
