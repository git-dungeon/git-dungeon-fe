import { z } from "zod";
import { createApiResponseSchema } from "@/shared/api/api-response";
import { dashboardResponseSchema } from "@/entities/dashboard/model/types";
import { inventoryResponseSchema } from "@/entities/inventory/model/types";
import {
  EMBED_LANGUAGE_VALUES,
  EMBED_PREVIEW_SIZE_VALUES,
  EMBED_THEME_VALUES,
} from "@/entities/embed/model/types";

export const embedPreviewPayloadSchema = z.object({
  theme: z.enum(EMBED_THEME_VALUES).default("dark"),
  size: z.enum(EMBED_PREVIEW_SIZE_VALUES).default("wide"),
  language: z.enum(EMBED_LANGUAGE_VALUES).default("ko"),
  generatedAt: z.string(),
  dashboard: dashboardResponseSchema,
  inventory: inventoryResponseSchema,
});

export const embedPreviewResponseSchema = createApiResponseSchema(
  embedPreviewPayloadSchema
);

export type EmbedPreviewPayload = z.infer<typeof embedPreviewPayloadSchema>;
export type EmbedPreviewResponse = z.infer<typeof embedPreviewResponseSchema>;
