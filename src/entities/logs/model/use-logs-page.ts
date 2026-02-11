import { useQuery } from "@tanstack/react-query";
import { getLogs, type FetchLogsParams } from "@/entities/logs/api/get-logs";
import { LOGS_DEFAULT_LIMIT } from "@/entities/logs/model/logs-query";

export function useLogsPage(params?: FetchLogsParams) {
  const limit = params?.limit ?? LOGS_DEFAULT_LIMIT;
  const type = params?.type;
  const cursor = params?.cursor;
  const from = params?.from;
  const to = params?.to;

  return useQuery({
    queryKey: [
      "logs",
      "page",
      {
        limit,
        cursor: cursor ?? null,
        type: type ?? null,
        from: from ?? null,
        to: to ?? null,
      },
    ] as const,
    queryFn: () =>
      getLogs({
        limit,
        cursor,
        type,
        from,
        to,
      }),
  });
}
