import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { dungeonLogsQueryOptions } from "@/entities/dungeon-log/model/dungeon-logs-query";
import type {
  DungeonLogsPayload,
  FetchDungeonLogsParams,
} from "@/entities/dungeon-log/api/get-dungeon-logs";

export function useDungeonLogs(
  params?: FetchDungeonLogsParams
): UseQueryResult<DungeonLogsPayload> {
  return useQuery(dungeonLogsQueryOptions(params));
}
