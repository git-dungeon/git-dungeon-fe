import { requestWithSchema } from "@/shared/api/http-client";
import { RANKING_ENDPOINTS } from "@/shared/config/env";
import {
  rankingListSchema,
  type RankingList,
} from "@/entities/ranking/model/types";

export interface FetchRankingParams {
  limit?: number;
  cursor?: string;
}

export async function getRanking(
  params: FetchRankingParams = {}
): Promise<RankingList> {
  const { limit, cursor } = params;
  const searchParams = new URLSearchParams();

  if (typeof limit === "number") {
    searchParams.set("limit", limit.toString());
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const endpoint = searchParams.size
    ? `${RANKING_ENDPOINTS.list}?${searchParams.toString()}`
    : RANKING_ENDPOINTS.list;

  return requestWithSchema(endpoint, rankingListSchema);
}
