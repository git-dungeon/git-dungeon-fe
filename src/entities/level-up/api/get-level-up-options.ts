import { LEVEL_UP_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  levelUpSelectionResponseSchema,
  type LevelUpSelectionResponse,
} from "@/entities/level-up/model/types";

export async function getLevelUpOptions(): Promise<LevelUpSelectionResponse> {
  return requestWithSchema(
    LEVEL_UP_ENDPOINTS.selection,
    levelUpSelectionResponseSchema
  );
}
