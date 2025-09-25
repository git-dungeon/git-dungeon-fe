import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { httpGet } from "@/shared/api/http-client";
import type { InventoryResponse } from "@/entities/inventory/model/types";

export async function getInventory(): Promise<InventoryResponse> {
  return httpGet<InventoryResponse>(INVENTORY_ENDPOINTS.list);
}
