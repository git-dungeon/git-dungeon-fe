import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getRanking,
  type FetchRankingParams,
} from "@/entities/ranking/api/get-ranking";

export const RANKING_DEFAULT_LIMIT = 10;

export function useInfiniteRanking(params: FetchRankingParams = {}) {
  const limit = params.limit ?? RANKING_DEFAULT_LIMIT;

  return useInfiniteQuery({
    queryKey: ["ranking", "infinite", { limit }] as const,
    queryFn: ({ pageParam }) =>
      getRanking({
        limit,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
