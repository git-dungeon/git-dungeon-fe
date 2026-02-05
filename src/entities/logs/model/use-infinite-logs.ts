import { useInfiniteQuery } from "@tanstack/react-query";
import { getLogs, type FetchLogsParams } from "@/entities/logs/api/get-logs";
import { LOGS_DEFAULT_LIMIT } from "@/entities/logs/model/logs-query";

export function useInfiniteLogs(params?: FetchLogsParams) {
  const limit = params?.limit ?? LOGS_DEFAULT_LIMIT;
  const type = params?.type;
  const from = params?.from;
  const to = params?.to;

  return useInfiniteQuery({
    queryKey: [
      "logs",
      "infinite",
      {
        limit,
        type: type ?? null,
        from: from ?? null,
        to: to ?? null,
      },
    ] as const,
    queryFn: ({ pageParam }) =>
      getLogs({
        limit,
        type,
        cursor: pageParam ?? undefined,
        from,
        to,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
