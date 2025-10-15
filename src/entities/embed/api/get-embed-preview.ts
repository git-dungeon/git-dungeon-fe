import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { httpGet } from "@/shared/api/http-client";
import {
  embedPreviewApiResponseSchema,
  embedPreviewSuccessSchema,
} from "@/entities/embed/model/embed-preview-schema";
import {
  type EmbedPreviewQueryParams,
  type EmbedPreviewResult,
} from "@/entities/embed/model/types";
import { buildCharacterOverview } from "@/features/character-summary/lib/build-character-overview";

class EmbedApiError extends Error {
  constructor(message: string) {
    super(message);
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

  const raw = await httpGet<unknown>(
    `${EMBEDDING_ENDPOINTS.preview}?${search.toString()}`,
    {
      includeAuthToken: false,
    }
  );

  const parsed = embedPreviewApiResponseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new EmbedApiError("임베드 응답 스키마가 올바르지 않습니다.");
  }

  if (parsed.data.success === false) {
    throw new EmbedApiError(parsed.data.error.message);
  }

  const successPayload = embedPreviewSuccessSchema.parse(parsed.data);
  const data = successPayload.data;
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
}
