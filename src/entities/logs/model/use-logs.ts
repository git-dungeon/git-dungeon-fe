import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { logsQueryOptions } from "@/entities/logs/model/logs-query";
import type { FetchLogsParams } from "@/entities/logs/api/get-logs";
import type { LogsPayload } from "@/entities/logs/model/types";

export function useLogs(params?: FetchLogsParams): UseQueryResult<LogsPayload> {
  return useQuery(logsQueryOptions(params));
}
