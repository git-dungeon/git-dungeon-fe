import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type { DashboardResponse } from "@/entities/dashboard/model/types";
import type { InventoryResponse } from "@/entities/inventory/model/types";

export const EMBED_THEME_VALUES = ["light", "dark"] as const;
export const EMBED_PREVIEW_SIZE_VALUES = ["compact", "square", "wide"] as const;
export const EMBED_LANGUAGE_VALUES = ["ko", "en"] as const;

export type EmbedPreviewTheme = (typeof EMBED_THEME_VALUES)[number];
export type EmbedPreviewSize = (typeof EMBED_PREVIEW_SIZE_VALUES)[number];
export type EmbedPreviewLanguage = (typeof EMBED_LANGUAGE_VALUES)[number];

export interface EmbedPreviewQueryParams {
  userId: string;
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
}

export interface EmbedPreviewResult {
  userId: string;
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  generatedAt: string;
  overview: CharacterOverview;
  dashboard: DashboardResponse;
  inventory: InventoryResponse;
}
