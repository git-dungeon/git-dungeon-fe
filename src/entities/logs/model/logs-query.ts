import { queryOptions } from "@tanstack/react-query";
import { getLogs, type FetchLogsParams } from "@/entities/logs/api/get-logs";

export const LOGS_DEFAULT_LIMIT = 10;

export function logsQueryKey(params?: FetchLogsParams) {
  const { limit = LOGS_DEFAULT_LIMIT, cursor, type, from, to } = params ?? {};

  return [
    "logs",
    {
      limit,
      cursor: cursor ?? null,
      type: type ?? null,
      from: from ?? null,
      to: to ?? null,
    },
  ] as const;
}

export function logsQueryOptions(params?: FetchLogsParams) {
  const queryParams: FetchLogsParams = {
    limit: params?.limit ?? LOGS_DEFAULT_LIMIT,
    cursor: params?.cursor,
    type: params?.type,
    from: params?.from,
    to: params?.to,
  };

  return queryOptions({
    queryKey: logsQueryKey(queryParams),
    queryFn: () => getLogs(queryParams),
    staleTime: 1000 * 15,
  });
}
