import { queryOptions } from "@tanstack/react-query";
import {
  getDungeonLogs,
  type FetchDungeonLogsParams,
} from "@/entities/dungeon-log/api/get-dungeon-logs";

const DEFAULT_LIMIT = 10;

export function dungeonLogsQueryKey(params?: FetchDungeonLogsParams) {
  const { limit = DEFAULT_LIMIT, cursor } = params ?? {};
  return ["dungeon-logs", { limit, cursor }] as const;
}

export function dungeonLogsQueryOptions(params?: FetchDungeonLogsParams) {
  const queryParams: FetchDungeonLogsParams = {
    limit: params?.limit ?? DEFAULT_LIMIT,
    cursor: params?.cursor,
  };

  return queryOptions({
    queryKey: dungeonLogsQueryKey(queryParams),
    queryFn: () => getDungeonLogs(queryParams),
    staleTime: 1000 * 15,
  });
}
