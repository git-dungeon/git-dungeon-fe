import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getDungeonLogs,
  type FetchDungeonLogsParams,
} from "@/entities/dungeon-log/api/get-dungeon-logs";
import { DUNGEON_LOGS_DEFAULT_LIMIT } from "@/entities/dungeon-log/model/dungeon-logs-query";

export function useInfiniteDungeonLogs(params?: FetchDungeonLogsParams) {
  const limit = params?.limit ?? DUNGEON_LOGS_DEFAULT_LIMIT;
  const type = params?.type;

  return useInfiniteQuery({
    queryKey: [
      "dungeon-logs",
      "infinite",
      {
        limit,
        type: type ?? null,
      },
    ] as const,
    queryFn: ({ pageParam }) =>
      getDungeonLogs({
        limit,
        type,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
