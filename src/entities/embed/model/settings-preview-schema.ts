import { z } from "zod";
import {
  equipmentModifierSchema,
  equipmentRaritySchema,
  equipmentSlotSchema,
} from "@/entities/dashboard/model/types";
import { inventoryItemEffectSchema } from "@/entities/inventory/model/types";
import { EMBED_PREVIEW_SIZE_VALUES } from "@/entities/embed/model/types";

const embedPreviewSizeSchema = z.enum(EMBED_PREVIEW_SIZE_VALUES);

const settingsEmbedStatValueSchema = z.object({
  total: z.number(),
  equipmentBonus: z.number().optional(),
});

const settingsEmbedHpSchema = z.object({
  current: z.number(),
  max: z.number(),
  equipmentBonus: z.number().optional(),
});

export type SettingsEmbedSize = z.infer<typeof embedPreviewSizeSchema>;

export const settingsEmbedStatBlockSchema = z.object({
  hp: settingsEmbedHpSchema,
  atk: settingsEmbedStatValueSchema,
  def: settingsEmbedStatValueSchema,
  luck: settingsEmbedStatValueSchema,
  ap: settingsEmbedStatValueSchema,
});

export const settingsEmbedEquipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: equipmentSlotSchema,
  rarity: equipmentRaritySchema,
  modifiers: z.array(equipmentModifierSchema),
  effect: inventoryItemEffectSchema.nullable().optional(),
  sprite: z.string(),
});

export const settingsEmbedPreviewSchema = z.object({
  userId: z.string(),
  size: embedPreviewSizeSchema,
  level: z.number(),
  exp: z.number(),
  expToLevel: z.number(),
  gold: z.number(),
  bestFloor: z.number(),
  currentFloor: z.number(),
  floorProgress: z.number(),
  stats: settingsEmbedStatBlockSchema,
  equipment: z.array(settingsEmbedEquipmentSchema),
  generatedAt: z.string(),
});

export type SettingsEmbedPreview = z.infer<typeof settingsEmbedPreviewSchema>;
