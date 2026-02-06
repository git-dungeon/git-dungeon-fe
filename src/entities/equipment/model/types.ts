import { z } from "zod";

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "ring"] as const;
const EQUIPMENT_ITEM_SLOTS = [
  ...EQUIPMENT_SLOTS,
  "consumable",
  "material",
] as const;

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

const inventoryStatSchema = z.enum(["hp", "maxHp", "atk", "def", "luck"]);
const inventoryModifierModeSchema = z.enum(["flat", "percent"]);

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
  quantity: z.number().int().min(1).default(1),
  enhancementLevel: z.number().int().min(0).optional(),
  version: z.number(),
});
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
