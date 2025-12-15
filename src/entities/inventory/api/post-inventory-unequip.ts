import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  inventoryItemMutationRequestSchema,
  inventoryResponseSchema,
  type InventoryItemMutationRequest,
  type InventoryResponse,
} from "@/entities/inventory/model/types";

export async function postInventoryUnequip(
  payload: InventoryItemMutationRequest
): Promise<InventoryResponse> {
  const body = inventoryItemMutationRequestSchema.parse(payload);

  return requestWithSchema(
    INVENTORY_ENDPOINTS.unequip,
    inventoryResponseSchema,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
}
