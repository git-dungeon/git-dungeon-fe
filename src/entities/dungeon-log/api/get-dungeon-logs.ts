import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { httpGetWithSchema } from "@/shared/api/http-client";
import type {
  DungeonLogCategory,
  DungeonLogsResponse,
} from "@/entities/dungeon-log/model/types";
import { dungeonLogsResponseSchema } from "@/entities/dungeon-log/model/types";

export type { DungeonLogsResponse } from "@/entities/dungeon-log/model/types";

export interface FetchDungeonLogsParams {
  limit?: number;
  cursor?: string;
  type?: DungeonLogCategory;
}

export async function getDungeonLogs(
  params: FetchDungeonLogsParams = {}
): Promise<DungeonLogsResponse> {
  const { limit, cursor, type } = params;
  const searchParams = new URLSearchParams();

  if (typeof limit === "number") {
    searchParams.set("limit", limit.toString());
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  if (type) {
    searchParams.set("type", type);
  }

  const endpoint = searchParams.size
    ? `${DASHBOARD_ENDPOINTS.logs}?${searchParams.toString()}`
    : DASHBOARD_ENDPOINTS.logs;

  return httpGetWithSchema(endpoint, dungeonLogsResponseSchema);
}
