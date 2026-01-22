import { queryOptions } from "@tanstack/react-query";
import {
  getRanking,
  type FetchRankingParams,
} from "@/entities/ranking/api/get-ranking";

export const RANKING_QUERY_KEY = ["ranking"] as const;

export function rankingQueryOptions(params: FetchRankingParams = {}) {
  const { limit, cursor } = params;

  return queryOptions({
    queryKey: [
      ...RANKING_QUERY_KEY,
      { limit: limit ?? null, cursor: cursor ?? null },
    ] as const,
    queryFn: () => getRanking({ limit, cursor }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
