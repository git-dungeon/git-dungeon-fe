import { CHEST_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  chestOpenResponseSchema,
  type ChestOpenResponse,
} from "@/entities/chest/model/types";

export async function postChestOpen(): Promise<ChestOpenResponse> {
  return requestWithSchema(CHEST_ENDPOINTS.open, chestOpenResponseSchema, {
    method: "POST",
  });
}
