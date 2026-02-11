import { useEffect, useMemo, useState } from "react";
import type { LogsFilterType } from "@/entities/logs/model/types";
import { useLogsPage } from "@/entities/logs/model/use-logs-page";
import { LOGS_PAGE_SIZE } from "@/widgets/logs/timeline/config/constants";

interface UseLogsTimelineParams {
  filterType?: LogsFilterType;
  pageSize?: number;
  from?: string;
  to?: string;
}

export function useLogsTimeline(params: UseLogsTimelineParams = {}) {
  const { filterType, pageSize = LOGS_PAGE_SIZE, from, to } = params;
  const [pageIndex, setPageIndex] = useState(0);
  const [cursorHistory, setCursorHistory] = useState<Array<string | undefined>>(
    [undefined]
  );

  useEffect(() => {
    setPageIndex(0);
    setCursorHistory([undefined]);
  }, [filterType, from, pageSize, to]);

  const currentCursor = cursorHistory[pageIndex];

  const query = useLogsPage({
    limit: pageSize,
    type: filterType,
    from,
    to,
    cursor: currentCursor,
  });

  const { data, status, error, isFetching, refetch } = query;

  const logs = useMemo(() => data?.logs ?? [], [data]);
  const hasNextPage = Boolean(data?.nextCursor);
  const hasPreviousPage = pageIndex > 0;
  const pageNumber = pageIndex + 1;

  const fetchNextPage = () => {
    if (!data?.nextCursor || isFetching) {
      return;
    }

    setCursorHistory((prev) => {
      const base = prev.slice(0, pageIndex + 1);
      return [...base, data.nextCursor ?? undefined];
    });
    setPageIndex((prev) => prev + 1);
  };

  const fetchPreviousPage = () => {
    if (!hasPreviousPage || isFetching) {
      return;
    }

    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  return {
    logs,
    status,
    error,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    pageNumber,
    refetch: () => {
      void refetch();
    },
  };
}
