import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import {
  inventoryItemMutationRequestSchema,
  inventoryResponseSchema,
  type InventoryItemMutationRequest,
} from "@/entities/inventory/model/types";
import { requestWithSchema } from "@/shared/api/http-client";

export async function postInventoryDismantle(
  payload: InventoryItemMutationRequest
) {
  const body = inventoryItemMutationRequestSchema.parse(payload);
  return requestWithSchema(
    INVENTORY_ENDPOINTS.dismantle,
    inventoryResponseSchema,
    {
      method: "POST",
      json: body,
    }
  );
}
