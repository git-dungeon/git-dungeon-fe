import { z } from "zod";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type { DashboardResponse } from "@/entities/dashboard/model/types";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import { embedPreviewPayloadSchema } from "@/entities/embed/model/embed-preview-schema";

export type EmbedPreviewApiPayload = z.infer<typeof embedPreviewPayloadSchema>;

export interface EmbedPreviewQueryParams {
  userId: string;
  theme: string;
}

export interface EmbedPreviewResult {
  userId: string;
  theme: string;
  generatedAt: string;
  overview: CharacterOverview;
  dashboard: DashboardResponse;
  inventory: InventoryResponse;
}
