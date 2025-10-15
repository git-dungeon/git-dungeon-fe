import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { httpGetWithSchema } from "@/shared/api/http-client";
import {
  inventoryResponseSchema,
  type InventoryResponse,
} from "@/entities/inventory/model/types";

export async function getInventory(): Promise<InventoryResponse> {
  return httpGetWithSchema(INVENTORY_ENDPOINTS.list, inventoryResponseSchema);
}
