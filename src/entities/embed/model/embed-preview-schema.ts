import { z } from "zod";
import { dashboardResponseSchema } from "@/entities/dashboard/model/types";
import { inventoryResponseSchema } from "@/entities/inventory/model/types";

const apiMetaSchema = z
  .object({
    requestId: z.string().optional(),
    generatedAt: z.string().optional(),
  })
  .optional();

const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
  meta: apiMetaSchema,
});

export const embedPreviewPayloadSchema = z.object({
  theme: z.string().default("dark"),
  generatedAt: z.string().optional(),
  dashboard: dashboardResponseSchema,
  inventory: inventoryResponseSchema,
});

export const embedPreviewSuccessSchema = z.object({
  success: z.literal(true),
  data: embedPreviewPayloadSchema,
  meta: apiMetaSchema,
});

export const embedPreviewApiResponseSchema = z.union([
  embedPreviewSuccessSchema,
  apiErrorSchema,
]);

export type EmbedPreviewSuccessResponse = z.infer<
  typeof embedPreviewSuccessSchema
>;
export type EmbedPreviewPayload = z.infer<typeof embedPreviewPayloadSchema>;
