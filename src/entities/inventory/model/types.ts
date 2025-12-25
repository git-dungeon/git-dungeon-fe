import { z } from "zod";
import {
  equipmentItemSchema,
  equipmentRaritySchema,
  equipmentSlotSchema,
  equipmentItemSlotSchema,
  inventoryModifierSchema,
  type EquipmentItem,
  type EquipmentItemSlot,
  type EquipmentSlot,
  type EquipmentRarity,
  type InventoryModifier,
} from "@/entities/dashboard/model/types";

export type InventoryItemSlot = EquipmentItemSlot;
export const inventoryItemSlotSchema = equipmentItemSlotSchema;

export type InventoryItem = EquipmentItem;
export const inventoryItemSchema = equipmentItemSchema;

export type { EquipmentSlot, EquipmentRarity, InventoryModifier };
export {
  equipmentSlotSchema,
  equipmentRaritySchema,
  inventoryModifierSchema,
  equipmentItemSchema,
};

export const inventoryItemEffectSchema = z.string();
export type InventoryItemEffect = z.infer<typeof inventoryItemEffectSchema>;

export const inventoryEquippedMapSchema = z
  .object({
    helmet: inventoryItemSchema.nullable().optional(),
    armor: inventoryItemSchema.nullable().optional(),
    weapon: inventoryItemSchema.nullable().optional(),
    ring: inventoryItemSchema.nullable().optional(),
    consumable: inventoryItemSchema.nullable().optional(),
  })
  .strict()
  .transform((value) => ({
    helmet: value.helmet ?? null,
    armor: value.armor ?? null,
    weapon: value.weapon ?? null,
    ring: value.ring ?? null,
    consumable: value.consumable ?? null,
  }));
export type InventoryEquippedMap = z.infer<typeof inventoryEquippedMapSchema>;

export const inventoryStatValuesSchema = z
  .object({
    hp: z.number(),
    atk: z.number(),
    def: z.number(),
    luck: z.number(),
  })
  .strict();
export type InventoryStatValues = z.infer<typeof inventoryStatValuesSchema>;

export const inventorySummarySchema = z
  .object({
    base: inventoryStatValuesSchema,
    total: inventoryStatValuesSchema,
    equipmentBonus: inventoryStatValuesSchema,
  })
  .strict();
export type InventorySummary = z.infer<typeof inventorySummarySchema>;

export const inventoryResponseSchema = z
  .object({
    version: z.number(),
    items: z.array(inventoryItemSchema),
    equipped: inventoryEquippedMapSchema,
    summary: inventorySummarySchema,
  })
  .strict();
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;

export const inventoryItemMutationRequestSchema = z
  .object({
    itemId: z.string(),
    expectedVersion: z.number(),
    inventoryVersion: z.number(),
  })
  .strict();
export type InventoryItemMutationRequest = z.infer<
  typeof inventoryItemMutationRequestSchema
>;
