import { useQuery } from "@tanstack/react-query";
import { embedPreviewQueryOptions } from "@/entities/embed/model/embed-preview-query";
import type { EmbedPreviewQueryParams } from "@/entities/embed/model/types";

interface UseEmbedPreviewOptions {
  enabled?: boolean;
}

export function useEmbedPreview(
  params: EmbedPreviewQueryParams,
  options: UseEmbedPreviewOptions = {}
) {
  return useQuery({
    ...embedPreviewQueryOptions(params),
    enabled: options.enabled,
  });
}
