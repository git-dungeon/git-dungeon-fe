import { queryOptions } from "@tanstack/react-query";
import { getInventory } from "@/entities/inventory/api/get-inventory";

export const INVENTORY_QUERY_KEY = ["inventory", "list"] as const;

export const inventoryQueryOptions = queryOptions({
  queryKey: INVENTORY_QUERY_KEY,
  queryFn: getInventory,
  staleTime: 1000 * 30,
});
