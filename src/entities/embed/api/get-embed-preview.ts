import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { ApiError, requestWithSchema } from "@/shared/api/http-client";
import { embedPreviewPayloadSchema } from "@/entities/embed/model/embed-preview-schema";
import {
  type EmbedPreviewQueryParams,
  type EmbedPreviewResult,
} from "@/entities/embed/model/types";
import { buildCharacterOverview } from "@/features/character-summary/lib/build-character-overview";

class EmbedApiError extends ApiError {
  constructor(error: ApiError) {
    super(error.message, error.status, error.payload);
    this.name = "EmbedApiError";
  }
}

export interface GetEmbedPreviewParams {
  userId: string;
  theme: EmbedPreviewQueryParams["theme"];
  size: EmbedPreviewQueryParams["size"];
  language: EmbedPreviewQueryParams["language"];
}

export async function getEmbedPreview(
  params: GetEmbedPreviewParams
): Promise<EmbedPreviewResult> {
  const search = new URLSearchParams({
    userId: params.userId,
    theme: params.theme,
    size: params.size,
    language: params.language,
  });

  try {
    const data = await requestWithSchema(
      `${EMBEDDING_ENDPOINTS.preview}?${search.toString()}`,
      embedPreviewPayloadSchema
    );

    const generatedAt = data.generatedAt;
    const dashboard = data.dashboard;
    const inventory = data.inventory;
    const overview = buildCharacterOverview(dashboard.state, inventory);
    const size = data.size ?? params.size;
    const language = data.language ?? params.language;

    return {
      userId: dashboard.state.userId,
      theme: data.theme ?? params.theme,
      size,
      language,
      generatedAt,
      overview,
      dashboard,
      inventory,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new EmbedApiError(error);
    }

    throw error;
  }
}
