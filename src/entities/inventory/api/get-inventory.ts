import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  inventoryResponseSchema,
  type InventoryResponse,
} from "@/entities/inventory/model/types";

export async function getInventory(): Promise<InventoryResponse> {
  return requestWithSchema(INVENTORY_ENDPOINTS.list, inventoryResponseSchema);
}
