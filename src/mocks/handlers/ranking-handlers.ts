import { http } from "msw";
import { respondWithSuccess } from "@/mocks/lib/api-response";
import { RANKING_ENDPOINTS } from "@/shared/config/env";
import { rankingFixture } from "@/mocks/fixtures/ranking";

export const rankingHandlers = [
  http.get(RANKING_ENDPOINTS.list, () => respondWithSuccess(rankingFixture)),
];
