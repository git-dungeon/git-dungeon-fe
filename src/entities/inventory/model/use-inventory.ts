import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { inventoryQueryOptions } from "@/entities/inventory/model/inventory-query";
import type { InventoryResponse } from "@/entities/inventory/model/types";

export function useInventory(): UseQueryResult<InventoryResponse> {
  return useQuery(inventoryQueryOptions);
}
