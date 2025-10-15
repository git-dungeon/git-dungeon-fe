import { z } from "zod";
import {
  equipmentModifierSchema,
  equipmentRaritySchema,
  equipmentSlotSchema,
} from "@/entities/dashboard/model/types";

export const inventoryItemEffectSchema = z.object({
  type: z.string(),
  description: z.string(),
});
export type InventoryItemEffect = z.infer<typeof inventoryItemEffectSchema>;

export const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: equipmentSlotSchema,
  rarity: equipmentRaritySchema,
  modifiers: z.array(equipmentModifierSchema),
  effect: inventoryItemEffectSchema.optional(),
  sprite: z.string(),
  createdAt: z.string(),
  isEquipped: z.boolean(),
});
export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const inventoryEquippedMapSchema = z.record(
  equipmentSlotSchema,
  inventoryItemSchema.nullable()
);
export type InventoryEquippedMap = z.infer<typeof inventoryEquippedMapSchema>;

export const inventoryStatValuesSchema = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  luck: z.number(),
});
export type InventoryStatValues = z.infer<typeof inventoryStatValuesSchema>;

export const inventorySummarySchema = z.object({
  total: inventoryStatValuesSchema,
  equipmentBonus: inventoryStatValuesSchema,
});
export type InventorySummary = z.infer<typeof inventorySummarySchema>;

export const inventoryResponseSchema = z.object({
  version: z.number(),
  items: z.array(inventoryItemSchema),
  equipped: inventoryEquippedMapSchema,
  summary: inventorySummarySchema,
});
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;
