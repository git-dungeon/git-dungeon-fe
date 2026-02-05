import { useEffect, useMemo, useRef } from "react";
import type { LogsFilterType } from "@/entities/logs/model/types";
import { useInfiniteLogs } from "@/entities/logs/model/use-infinite-logs";
import { LOGS_PAGE_SIZE } from "@/widgets/logs/timeline/config/constants";

interface UseLogsTimelineParams {
  filterType?: LogsFilterType;
  pageSize?: number;
  from?: string;
  to?: string;
}

export function useLogsTimeline(params: UseLogsTimelineParams = {}) {
  const { filterType, pageSize = LOGS_PAGE_SIZE, from, to } = params;

  const query = useInfiniteLogs({
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
