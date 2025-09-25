import { useEffect, useMemo, useRef } from "react";
import type { DungeonLogCategory } from "@/entities/dungeon-log/model/types";
import { useInfiniteDungeonLogs } from "@/entities/dungeon-log/model/use-infinite-dungeon-logs";
import { DUNGEON_LOGS_PAGE_SIZE } from "@/widgets/dungeon-log-timeline/config/constants";

interface UseDungeonLogTimelineParams {
  category?: DungeonLogCategory;
  pageSize?: number;
}

export function useDungeonLogTimeline(
  params: UseDungeonLogTimelineParams = {}
) {
  const { category, pageSize = DUNGEON_LOGS_PAGE_SIZE } = params;

  const query = useInfiniteDungeonLogs({
    limit: pageSize,
    type: category,
  });

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = query;

  const logs = useMemo(
    () => data?.pages.flatMap((page) => page.logs) ?? [],
    [data]
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const node = sentinelRef.current;
    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, status]);

  return {
    logs,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    sentinelRef,
  };
}
