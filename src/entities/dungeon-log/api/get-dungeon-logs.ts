import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import type {
  DungeonLogsFilterType,
  DungeonLogsPayload,
} from "@/entities/dungeon-log/model/types";
import { dungeonLogsPayloadSchema } from "@/entities/dungeon-log/model/types";

export type { DungeonLogsPayload } from "@/entities/dungeon-log/model/types";

export interface FetchDungeonLogsParams {
  limit?: number;
  cursor?: string;
  type?: DungeonLogsFilterType;
}

export async function getDungeonLogs(
  params: FetchDungeonLogsParams = {}
): Promise<DungeonLogsPayload> {
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

  return requestWithSchema(endpoint, dungeonLogsPayloadSchema);
}
