import { useMemo } from "react";
import { useInfiniteRanking } from "@/entities/ranking/model/use-infinite-ranking";

interface UseRankingListParams {
  limit?: number;
}

export function useRankingList(params: UseRankingListParams = {}) {
  const { limit } = params;
  const query = useInfiniteRanking({ limit });

  const {
    data,
    status,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = query;

  const rankings = useMemo(
    () => data?.pages.flatMap((page) => page.rankings) ?? [],
    [data]
  );

  return {
    rankings,
    status,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
