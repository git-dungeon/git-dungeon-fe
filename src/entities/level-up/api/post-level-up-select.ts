import { LEVEL_UP_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  levelUpApplyRequestSchema,
  levelUpApplyResponseSchema,
  type LevelUpApplyRequest,
  type LevelUpApplyResponse,
} from "@/entities/level-up/model/types";

export async function postLevelUpSelect(
  payload: LevelUpApplyRequest
): Promise<LevelUpApplyResponse> {
  const body = levelUpApplyRequestSchema.parse(payload);

  return requestWithSchema(
    LEVEL_UP_ENDPOINTS.apply,
    levelUpApplyResponseSchema,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
}
