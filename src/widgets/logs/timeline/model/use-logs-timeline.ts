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

interface CursorPaginationState {
  filterKey: string;
  pageIndex: number;
  cursorHistory: Array<string | undefined>;
}

export function useLogsTimeline(params: UseLogsTimelineParams = {}) {
  const { filterType, pageSize = LOGS_PAGE_SIZE, from, to } = params;
  const filterKey = `${filterType ?? "ALL"}|${from ?? ""}|${to ?? ""}|${pageSize}`;
  const [pagination, setPagination] = useState<CursorPaginationState>(() => ({
    filterKey,
    pageIndex: 0,
    cursorHistory: [undefined],
  }));

  const isFilterChanged = pagination.filterKey !== filterKey;
  const activePageIndex = isFilterChanged ? 0 : pagination.pageIndex;
  const activeCursorHistory = isFilterChanged
    ? [undefined]
    : pagination.cursorHistory;
  const currentCursor = activeCursorHistory[activePageIndex];

  useEffect(() => {
    setPagination((prev) =>
      prev.filterKey === filterKey
        ? prev
        : { filterKey, pageIndex: 0, cursorHistory: [undefined] }
    );
  }, [filterKey]);

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
  const hasPreviousPage = activePageIndex > 0;
  const pageNumber = activePageIndex + 1;

  const fetchNextPage = () => {
    if (!data?.nextCursor || isFetching) {
      return;
    }

    setPagination((prev) => {
      const current =
        prev.filterKey === filterKey
          ? prev
          : { filterKey, pageIndex: 0, cursorHistory: [undefined] };
      const base = current.cursorHistory.slice(0, current.pageIndex + 1);

      return {
        ...current,
        pageIndex: current.pageIndex + 1,
        cursorHistory: [...base, data.nextCursor ?? undefined],
      };
    });
  };

  const fetchPreviousPage = () => {
    if (isFetching) {
      return;
    }

    setPagination((prev) => {
      const current =
        prev.filterKey === filterKey
          ? prev
          : { filterKey, pageIndex: 0, cursorHistory: [undefined] };

      if (current.pageIndex <= 0) {
        return current;
      }

      return {
        ...current,
        pageIndex: current.pageIndex - 1,
      };
    });
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
