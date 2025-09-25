import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError, httpRequest } from "@/shared/api/http-client";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryResponse,
  InventoryStatValues,
} from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";

interface InventoryActionPayload {
  itemId: string;
}

type InventoryActionType = "equip" | "unequip" | "discard";

interface InventoryActionFailure {
  source: InventoryActionType;
  code?: string;
  error: Error;
}

interface MutationContext {
  previous?: InventoryResponse;
  optimisticVersion?: number;
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
  const [lastError, setLastError] = useState<InventoryActionFailure | null>(
    null
  );

  const handleSuccess = (next: InventoryResponse) => {
    queryClient.setQueryData(
      INVENTORY_QUERY_KEY,
      (current?: InventoryResponse) => {
        if (!current) {
          return next;
        }

        const nextVersion = next.version ?? 0;
        const currentVersion = current.version ?? 0;

        if (nextVersion >= currentVersion) {
          return next;
        }

        return current;
      }
    );
    queryClient.invalidateQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY });
  };

  const createOptimisticHandler = (type: InventoryActionType) => {
    return async (
      payload: InventoryActionPayload
    ): Promise<MutationContext> => {
      setLastError(null);
      await queryClient.cancelQueries({ queryKey: INVENTORY_QUERY_KEY });

      const previous =
        queryClient.getQueryData<InventoryResponse>(INVENTORY_QUERY_KEY);

      let optimisticVersion: number | undefined;

      if (previous) {
        const optimistic = buildOptimisticInventory(
          previous,
          type,
          payload.itemId
        );
        queryClient.setQueryData(INVENTORY_QUERY_KEY, optimistic);
        optimisticVersion = optimistic.version;
      }

      return { previous, optimisticVersion };
    };
  };

  const equipMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.equip, payload),
    onMutate: createOptimisticHandler("equip"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      setLastError(buildActionFailure("equip", error));
      rollbackOnError(queryClient, context);
    },
  });

  const unequipMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.unequip, payload),
    onMutate: createOptimisticHandler("unequip"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      setLastError(buildActionFailure("unequip", error));
      rollbackOnError(queryClient, context);
    },
  });

  const discardMutation = useMutation({
    mutationFn: (payload: InventoryActionPayload) =>
      createInventoryRequest(INVENTORY_ENDPOINTS.discard, payload),
    onMutate: createOptimisticHandler("discard"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      setLastError(buildActionFailure("discard", error));
      rollbackOnError(queryClient, context);
    },
    retry: false,
  });

  const actionErrors = [
    { source: "equip" as const, error: equipMutation.error },
    { source: "unequip" as const, error: unequipMutation.error },
    { source: "discard" as const, error: discardMutation.error },
  ];

  const errorMap = buildActionErrorMap(actionErrors);

  const fallbackError = actionErrors.find(
    (entry) => entry.error instanceof Error
  )?.error as Error | undefined;

  const aggregatedError = lastError?.error ?? fallbackError ?? null;

  return {
    equip: (itemId: string) => equipMutation.mutateAsync({ itemId }),
    unequip: (itemId: string) => unequipMutation.mutateAsync({ itemId }),
    discard: (itemId: string) => discardMutation.mutateAsync({ itemId }),
    isPending:
      equipMutation.isPending ||
      unequipMutation.isPending ||
      discardMutation.isPending,
    error: aggregatedError,
    lastError,
    errorMap,
  } as const;
}

function buildOptimisticInventory(
  previous: InventoryResponse,
  action: InventoryActionType,
  targetId: string
): InventoryResponse {
  const items = applyOptimisticItems(previous.items, action, targetId);
  const equipped = buildEquippedMap(items);

  const equipmentBonus = calculateEquipmentBonus(equipped);
  const baseStats = calculateBaseStats(previous.summary);
  const total = mergeBaseWithEquipment(baseStats, equipmentBonus);

  return {
    version: (previous.version ?? 0) + 1,
    items,
    equipped,
    summary: {
      total,
      equipmentBonus,
    },
  };
}

function applyOptimisticItems(
  items: InventoryItem[],
  action: InventoryActionType,
  targetId: string
): InventoryItem[] {
  const targetSlot = findSlotByItemId(items, targetId);

  if (action === "discard") {
    return items.filter((item) => item.id !== targetId);
  }

  return items.map((item) => {
    if (item.id !== targetId) {
      if (action === "equip" && targetSlot && item.slot === targetSlot) {
        return { ...item, isEquipped: false };
      }
      return item;
    }

    if (action === "equip") {
      return { ...item, isEquipped: true };
    }

    if (action === "unequip") {
      return { ...item, isEquipped: false };
    }

    return item;
  });
}

function findSlotByItemId(
  items: InventoryItem[],
  itemId: string
): EquipmentSlot | undefined {
  return items.find((item) => item.id === itemId)?.slot;
}

function buildEquippedMap(items: InventoryItem[]): InventoryEquippedMap {
  const initial: InventoryEquippedMap = {
    helmet: null,
    armor: null,
    weapon: null,
    ring: null,
  };

  return items.reduce<InventoryEquippedMap>((acc, item) => {
    if (item.isEquipped) {
      acc[item.slot] = { ...item };
    }
    return acc;
  }, initial);
}

function calculateEquipmentBonus(
  equipped: InventoryEquippedMap
): InventoryStatValues {
  const bonus: InventoryStatValues = {
    hp: 0,
    atk: 0,
    def: 0,
    luck: 0,
  };

  Object.values(equipped).forEach((item) => {
    if (!item) {
      return;
    }

    item.modifiers.forEach((modifier) => {
      if (modifier.stat in bonus) {
        bonus[modifier.stat as keyof InventoryStatValues] += modifier.value;
      }
    });
  });

  return bonus;
}

function calculateBaseStats(
  summary: InventoryResponse["summary"]
): InventoryStatValues {
  return {
    hp: summary.total.hp - summary.equipmentBonus.hp,
    atk: summary.total.atk - summary.equipmentBonus.atk,
    def: summary.total.def - summary.equipmentBonus.def,
    luck: summary.total.luck - summary.equipmentBonus.luck,
  };
}

function buildActionFailure(
  source: InventoryActionType,
  error: unknown
): InventoryActionFailure {
  const normalizedError =
    error instanceof Error
      ? error
      : new Error(String(error ?? "Unknown error"));

  return {
    source,
    code: resolveErrorCode(error),
    error: normalizedError,
  };
}

function resolveErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiError) {
    return String(error.status);
  }

  if (error && typeof error === "object" && "code" in error) {
    const rawCode = (error as Record<string, unknown>).code;
    if (typeof rawCode === "string") {
      return rawCode;
    }
  }

  return undefined;
}

function buildActionErrorMap(
  entries: Array<{ source: InventoryActionType; error: unknown }>
): Partial<Record<InventoryActionType, InventoryActionFailure>> {
  return entries.reduce<
    Partial<Record<InventoryActionType, InventoryActionFailure>>
  >((acc, { source, error }) => {
    if (error) {
      acc[source] = buildActionFailure(source, error);
    }
    return acc;
  }, {});
}

function rollbackOnError(queryClient: QueryClient, context?: MutationContext) {
  if (!context?.previous) {
    return;
  }

  const current =
    queryClient.getQueryData<InventoryResponse>(INVENTORY_QUERY_KEY);
  const currentVersion = current?.version ?? 0;
  const optimisticVersion = context.optimisticVersion ?? 0;

  if (currentVersion <= optimisticVersion) {
    queryClient.setQueryData(INVENTORY_QUERY_KEY, context.previous);
  }
}

function mergeBaseWithEquipment(
  base: InventoryStatValues,
  equipment: InventoryStatValues
): InventoryStatValues {
  return {
    hp: base.hp + equipment.hp,
    atk: base.atk + equipment.atk,
    def: base.def + equipment.def,
    luck: base.luck + equipment.luck,
  };
}
