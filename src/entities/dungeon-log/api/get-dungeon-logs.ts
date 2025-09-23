import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { httpGet } from "@/shared/api/http-client";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";

export interface DungeonLogsResponse {
  logs: DungeonLogEntry[];
  nextCursor?: string;
}

export interface FetchDungeonLogsParams {
  limit?: number;
  cursor?: string;
}

export async function getDungeonLogs(
  params: FetchDungeonLogsParams = {}
): Promise<DungeonLogsResponse> {
  const { limit, cursor } = params;
  const searchParams = new URLSearchParams();

  if (typeof limit === "number") {
    searchParams.set("limit", limit.toString());
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const endpoint = searchParams.size
    ? `${DASHBOARD_ENDPOINTS.logs}?${searchParams.toString()}`
    : DASHBOARD_ENDPOINTS.logs;

  return httpGet<DungeonLogsResponse>(endpoint);
}
