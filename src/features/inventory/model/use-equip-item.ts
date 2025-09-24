import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/shared/api/http-client";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";

interface EquipItemPayload {
  itemId: string;
}

async function equipItemRequest(
  payload: EquipItemPayload
): Promise<InventoryResponse> {
  return httpRequest<InventoryResponse>(INVENTORY_ENDPOINTS.equip, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function useEquipItem() {
  const queryClient = useQueryClient();

  return useMutation<InventoryResponse, unknown, EquipItemPayload>({
    mutationFn: equipItemRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(INVENTORY_QUERY_KEY, data);
      void queryClient.invalidateQueries({
        queryKey: DASHBOARD_STATE_QUERY_KEY,
      });
    },
  });
}
