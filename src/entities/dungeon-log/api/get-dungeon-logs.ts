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
  from?: string;
  to?: string;
}

function setOptionalParam(
  params: URLSearchParams,
  key: string,
  value?: string
): void {
  if (typeof value !== "string") {
    return;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }
  params.set(key, trimmed);
}

export async function getDungeonLogs(
  params: FetchDungeonLogsParams = {}
): Promise<DungeonLogsPayload> {
  const { limit, cursor, type, from, to } = params;
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

  setOptionalParam(searchParams, "from", from);
  setOptionalParam(searchParams, "to", to);

  const endpoint = searchParams.size
    ? `${DASHBOARD_ENDPOINTS.logs}?${searchParams.toString()}`
    : DASHBOARD_ENDPOINTS.logs;

  return requestWithSchema(endpoint, dungeonLogsPayloadSchema);
}
