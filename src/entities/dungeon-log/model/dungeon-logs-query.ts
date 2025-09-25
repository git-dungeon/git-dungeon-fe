import { queryOptions } from "@tanstack/react-query";
import {
  getDungeonLogs,
  type FetchDungeonLogsParams,
} from "@/entities/dungeon-log/api/get-dungeon-logs";

export const DUNGEON_LOGS_DEFAULT_LIMIT = 10;

export function dungeonLogsQueryKey(params?: FetchDungeonLogsParams) {
  const { limit = DUNGEON_LOGS_DEFAULT_LIMIT, cursor, type } = params ?? {};

  return [
    "dungeon-logs",
    {
      limit,
      cursor: cursor ?? null,
      type: type ?? null,
    },
  ] as const;
}

export function dungeonLogsQueryOptions(params?: FetchDungeonLogsParams) {
  const queryParams: FetchDungeonLogsParams = {
    limit: params?.limit ?? DUNGEON_LOGS_DEFAULT_LIMIT,
    cursor: params?.cursor,
    type: params?.type,
  };

  return queryOptions({
    queryKey: dungeonLogsQueryKey(queryParams),
    queryFn: () => getDungeonLogs(queryParams),
    staleTime: 1000 * 15,
  });
}
