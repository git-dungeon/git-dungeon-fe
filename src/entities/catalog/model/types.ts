import { z } from "zod";

const inventoryStatSchema = z.enum(["hp", "atk", "def", "luck"]);
const inventoryModifierModeSchema = z.enum(["flat", "percent"]);

export const inventoryStatModifierSchema = z.object({
  kind: z.literal("stat"),
  stat: inventoryStatSchema,
  mode: inventoryModifierModeSchema,
  value: z.number(),
});

export const inventoryEffectModifierSchema = z.object({
  kind: z.literal("effect"),
  effectCode: z.string(),
  params: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const inventoryModifierSchema = z.union([
  inventoryStatModifierSchema,
  inventoryEffectModifierSchema,
]);
export type InventoryModifier = z.infer<typeof inventoryModifierSchema>;

export const catalogItemSchema = z.object({
  code: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string().nullable(),
  name: z.string(),
  slot: z.enum(["weapon", "armor", "helmet", "ring", "consumable", "material"]),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  modifiers: z.array(inventoryModifierSchema),
  effectCode: z.string().nullable(),
  spriteId: z.string(),
  description: z.string().nullable(),
});
export type CatalogItem = z.infer<typeof catalogItemSchema>;

export const catalogBuffSchema = z.object({
  buffId: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string().nullable(),
  name: z.string(),
  effectCode: z.string(),
  durationTurns: z.number().int().nullable(),
  maxStacks: z.number().int().nullable(),
  spriteId: z.string().nullable(),
  description: z.string().nullable(),
});
export type CatalogBuff = z.infer<typeof catalogBuffSchema>;

export const catalogMonsterSchema = z.object({
  code: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string().nullable(),
  name: z.string(),
  hp: z.number().int(),
  atk: z.number().int(),
  def: z.number().int(),
  spriteId: z.string(),
  dropTableId: z.string().nullable(),
  description: z.string().nullable(),
});
export type CatalogMonster = z.infer<typeof catalogMonsterSchema>;

export type EnhancementSlot = "weapon" | "armor" | "helmet" | "ring";

export const catalogEnhancementConfigSchema = z
  .object({
    maxLevel: z.number().int().min(1),
    successRates: z.record(z.string(), z.number()),
    goldCosts: z.record(z.string(), z.number()),
    materialCounts: z.record(z.string(), z.number().int().min(0)),
    materialsBySlot: z
      .object({
        weapon: z.string(),
        armor: z.string(),
        helmet: z.string(),
        ring: z.string(),
      })
      .strict(),
  })
  .strict();
export type CatalogEnhancementConfig = z.infer<
  typeof catalogEnhancementConfigSchema
>;

export const catalogDismantleConfigSchema = z
  .object({
    baseMaterialQuantityByRarity: z
      .object({
        common: z.number().int().min(0),
        uncommon: z.number().int().min(0),
        rare: z.number().int().min(0),
        epic: z.number().int().min(0),
        legendary: z.number().int().min(0),
      })
      .strict(),
    refundByEnhancementLevel: z.record(z.string(), z.number().int().min(0)),
  })
  .strict();
export type CatalogDismantleConfig = z.infer<
  typeof catalogDismantleConfigSchema
>;

export const catalogDataSchema = z.object({
  version: z.number(),
  updatedAt: z.string(),
  items: z.array(catalogItemSchema),
  buffs: z.array(catalogBuffSchema),
  monsters: z.array(catalogMonsterSchema),
  enhancement: catalogEnhancementConfigSchema,
  dismantle: catalogDismantleConfigSchema,
  assetsBaseUrl: z.string().nullable().optional(),
  spriteMap: z.record(z.string(), z.string()).nullable().optional(),
});
export type CatalogData = z.infer<typeof catalogDataSchema>;
