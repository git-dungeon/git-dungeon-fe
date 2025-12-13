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
  slot: z.enum(["weapon", "armor", "helmet", "ring", "consumable"]),
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
  id: z.string(),
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

export const catalogDataSchema = z.object({
  version: z.number(),
  updatedAt: z.string(),
  items: z.array(catalogItemSchema),
  buffs: z.array(catalogBuffSchema),
  monsters: z.array(catalogMonsterSchema),
  assetsBaseUrl: z.string().nullable().optional(),
  spriteMap: z.record(z.string(), z.string()).nullable().optional(),
});
export type CatalogData = z.infer<typeof catalogDataSchema>;
