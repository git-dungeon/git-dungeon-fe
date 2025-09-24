import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/shared/api/http-client";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";

interface InventoryActionPayload {
  itemId: string;
}

function createInventoryRequest(
  endpoint: string,
  payload: InventoryActionPayload
) {
  return httpRequest<InventoryResponse>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function useInventoryActions() {
  const queryClient = useQueryClient();

  const handleSuccess = (next: InventoryResponse) => {
    queryClient.setQueryData(INVENTORY_QUERY_KEY, next);
    void queryClient.invalidateQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY });
  };

  const equipMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.equip, payload),
    onSuccess: handleSuccess,
  });

  const unequipMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.unequip, payload),
    onSuccess: handleSuccess,
  });

  const discardMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.discard, payload),
    onSuccess: handleSuccess,
  });

  const hasError = [
    equipMutation.error,
    unequipMutation.error,
    discardMutation.error,
  ].find(Boolean);

  return {
    equip: (itemId: string) => equipMutation.mutateAsync({ itemId }),
    unequip: (itemId: string) => unequipMutation.mutateAsync({ itemId }),
    discard: (itemId: string) => discardMutation.mutateAsync({ itemId }),
    isPending:
      equipMutation.isPending ||
      unequipMutation.isPending ||
      discardMutation.isPending,
    error: hasError instanceof Error ? hasError : null,
  } as const;
}
