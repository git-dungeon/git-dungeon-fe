import { queryOptions } from "@tanstack/react-query";
import { getEmbedPreview } from "@/entities/embed/api/get-embed-preview";
import type { EmbedPreviewQueryParams } from "@/entities/embed/model/types";

export const embedPreviewQueryOptions = (params: EmbedPreviewQueryParams) =>
  queryOptions({
    queryKey: [
      "embed",
      "preview",
      params.userId,
      params.theme,
      params.size,
      params.language,
    ] as const,
    queryFn: () => getEmbedPreview(params),
    staleTime: 1000 * 60,
  });
