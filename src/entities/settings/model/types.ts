import { z } from "zod";
import { authSessionSchema } from "@/entities/auth/model/types";
import {
  equipmentModifierSchema,
  equipmentRaritySchema,
  equipmentSlotSchema,
} from "@/entities/dashboard/model/types";
import { inventoryItemEffectSchema } from "@/entities/inventory/model/types";
export type {
  LanguagePreference,
  ThemePreference,
} from "@/shared/lib/preferences/types";

export const settingsProfileSchema = authSessionSchema.extend({
  email: z.string().optional(),
  joinedAt: z.string().optional(),
  lastLoginAt: z.string().optional(),
});
export type SettingsProfile = z.infer<typeof settingsProfileSchema>;

const settingsGithubConnectionSchema = z.object({
  connected: z.boolean(),
  lastSyncAt: z.string().optional(),
  profileUrl: z.string().optional(),
});

export const settingsConnectionsSchema = z.object({
  github: settingsGithubConnectionSchema.optional(),
});
export type SettingsConnections = z.infer<typeof settingsConnectionsSchema>;

export const settingsDataSchema = z.object({
  profile: settingsProfileSchema,
  connections: settingsConnectionsSchema,
});
export type SettingsData = z.infer<typeof settingsDataSchema>;

export const settingsResponseSchema = z.object({
  settings: settingsDataSchema,
});
export type SettingsResponse = z.infer<typeof settingsResponseSchema>;

export const embeddingSizeSchema = z.enum(["compact", "square", "wide"]);
export type EmbeddingSize = z.infer<typeof embeddingSizeSchema>;

const embeddingStatValueSchema = z.object({
  total: z.number(),
  equipmentBonus: z.number().optional(),
});

const embeddingHpSchema = z.object({
  current: z.number(),
  max: z.number(),
  equipmentBonus: z.number().optional(),
});

export const embeddingStatBlockSchema = z.object({
  hp: embeddingHpSchema,
  atk: embeddingStatValueSchema,
  def: embeddingStatValueSchema,
  luck: embeddingStatValueSchema,
  ap: embeddingStatValueSchema,
});
export type EmbeddingStatBlock = z.infer<typeof embeddingStatBlockSchema>;

export const embeddingEquipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: equipmentSlotSchema,
  rarity: equipmentRaritySchema,
  modifiers: z.array(equipmentModifierSchema),
  effect: inventoryItemEffectSchema.nullable().optional(),
  sprite: z.string(),
});
export type EmbeddingEquipment = z.infer<typeof embeddingEquipmentSchema>;

export const embeddingPreviewSchema = z.object({
  userId: z.string(),
  size: embeddingSizeSchema,
  level: z.number(),
  exp: z.number(),
  expToLevel: z.number(),
  gold: z.number(),
  bestFloor: z.number(),
  currentFloor: z.number(),
  floorProgress: z.number(),
  stats: embeddingStatBlockSchema,
  equipment: z.array(embeddingEquipmentSchema),
  generatedAt: z.string(),
});
export type EmbeddingPreview = z.infer<typeof embeddingPreviewSchema>;

export const embeddingPreviewResponseSchema = z.object({
  preview: embeddingPreviewSchema,
});
export type EmbeddingPreviewResponse = z.infer<
  typeof embeddingPreviewResponseSchema
>;
