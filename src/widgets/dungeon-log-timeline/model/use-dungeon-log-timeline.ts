import { useEffect, useMemo, useRef } from "react";
import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { useInfiniteDungeonLogs } from "@/entities/dungeon-log/model/use-infinite-dungeon-logs";
import { DUNGEON_LOGS_PAGE_SIZE } from "@/widgets/dungeon-log-timeline/config/constants";

interface UseDungeonLogTimelineParams {
  filterType?: DungeonLogsFilterType;
  pageSize?: number;
  from?: string;
  to?: string;
}

export function useDungeonLogTimeline(
  params: UseDungeonLogTimelineParams = {}
) {
  const { filterType, pageSize = DUNGEON_LOGS_PAGE_SIZE, from, to } = params;

  const query = useInfiniteDungeonLogs({
    limit: pageSize,
    type: filterType,
    from,
    to,
  });

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
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    sentinelRef,
  };
}
