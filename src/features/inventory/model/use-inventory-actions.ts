import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "@/shared/api/http-client";
import { i18next } from "@/shared/i18n/i18n";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryItemMutationRequest,
  InventoryItemSlot,
  InventoryResponse,
  InventoryStatValues,
} from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import { postInventoryDiscard } from "@/entities/inventory/api/post-inventory-discard";
import { postInventoryEquip } from "@/entities/inventory/api/post-inventory-equip";
import { postInventoryUnequip } from "@/entities/inventory/api/post-inventory-unequip";

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

type InventoryActionVariables = InventoryItemMutationRequest;

export function useInventoryActions() {
  const queryClient = useQueryClient();
  const [lastError, setLastError] = useState<InventoryActionFailure | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);

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
    queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["dungeon-logs"] });
  };

  const syncInventory = async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: INVENTORY_QUERY_KEY }),
      queryClient.refetchQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY }),
    ]);
  };

  const createOptimisticHandler = (type: InventoryActionType) => {
    return async (
      payload: InventoryActionVariables
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
    mutationFn: postInventoryEquip,
    onMutate: createOptimisticHandler("equip"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      if (!isVersionMismatchError(error)) {
        setLastError(buildActionFailure("equip", error));
      }
      rollbackOnError(queryClient, context);
    },
  });

  const unequipMutation = useMutation({
    mutationFn: postInventoryUnequip,
    onMutate: createOptimisticHandler("unequip"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      if (!isVersionMismatchError(error)) {
        setLastError(buildActionFailure("unequip", error));
      }
      rollbackOnError(queryClient, context);
    },
  });

  const discardMutation = useMutation({
    mutationFn: postInventoryDiscard,
    onMutate: createOptimisticHandler("discard"),
    onSuccess: handleSuccess,
    onError: (error, _variables, context) => {
      if (!isVersionMismatchError(error)) {
        setLastError(buildActionFailure("discard", error));
      }
      rollbackOnError(queryClient, context);
    },
    retry: false,
  });

  const executeWithRetry = async (
    type: InventoryActionType,
    itemId: string,
    mutation: typeof equipMutation
  ) => {
    const variables = buildInventoryMutationVariables(queryClient, itemId);

    try {
      await mutation.mutateAsync(variables);
      return;
    } catch (error) {
      if (!isVersionMismatchError(error)) {
        throw error;
      }

      setIsSyncing(true);
      setLastError(null);

      try {
        await syncInventory();
        await mutation.mutateAsync(
          buildInventoryMutationVariables(queryClient, itemId)
        );
      } catch (retryError) {
        setLastError(buildActionFailure(type, retryError));
        throw retryError;
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const actionErrors = [
    { source: "equip" as const, error: equipMutation.error },
    { source: "unequip" as const, error: unequipMutation.error },
    { source: "discard" as const, error: discardMutation.error },
  ];

  const errorMap = buildActionErrorMap(actionErrors);

  const fallbackError = actionErrors.find(
    (entry) => entry.error instanceof Error
  )?.error as Error | undefined;

  const suppressedFallback =
    isSyncing && fallbackError && isVersionMismatchError(fallbackError)
      ? null
      : fallbackError;
  const aggregatedError = isSyncing
    ? null
    : (lastError?.error ?? suppressedFallback ?? null);

  const clearError = () => {
    setLastError(null);
    equipMutation.reset();
    unequipMutation.reset();
    discardMutation.reset();
  };

  return {
    equip: (itemId: string) => executeWithRetry("equip", itemId, equipMutation),
    unequip: (itemId: string) =>
      executeWithRetry("unequip", itemId, unequipMutation),
    discard: (itemId: string) =>
      executeWithRetry("discard", itemId, discardMutation),
    isPending:
      equipMutation.isPending ||
      unequipMutation.isPending ||
      discardMutation.isPending,
    isSyncing,
    error: aggregatedError,
    lastError,
    errorMap,
    clearError,
  } as const;
}

function buildInventoryMutationVariables(
  queryClient: QueryClient,
  itemId: string
): InventoryActionVariables {
  const current =
    queryClient.getQueryData<InventoryResponse>(INVENTORY_QUERY_KEY);
  const inventoryVersion = current?.version ?? 0;
  const itemVersion =
    current?.items.find((item) => item.id === itemId)?.version ?? 0;

  return {
    itemId,
    expectedVersion: itemVersion,
    inventoryVersion,
  };
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
      base: baseStats,
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
): InventoryItemSlot | undefined {
  return items.find((item) => item.id === itemId)?.slot;
}

function buildEquippedMap(items: InventoryItem[]): InventoryEquippedMap {
  const initial: InventoryEquippedMap = {
    helmet: null,
    armor: null,
    weapon: null,
    ring: null,
    consumable: null,
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

    if (item.slot === "consumable") {
      return;
    }

    item.modifiers.forEach((modifier) => {
      if (modifier.kind !== "stat") {
        return;
      }
      if (modifier.mode !== "flat") {
        return;
      }
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
  if (summary.base) {
    return summary.base;
  }

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
  const message = resolveInventoryActionMessage(error);
  const normalizedError =
    error instanceof Error
      ? new Error(message)
      : new Error(String(error ?? "Unknown error"));

  return {
    source,
    code: resolveErrorCode(error),
    error: normalizedError,
  };
}

function resolveErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiError) {
    const payload = error.payload;
    const apiCode =
      payload && typeof payload === "object"
        ? (payload as { error?: { code?: unknown } }).error?.code
        : undefined;

    if (typeof apiCode === "string" && apiCode.length > 0) {
      return apiCode;
    }

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

function resolveInventoryActionMessage(error: unknown): string {
  const t = (key: string) => i18next.t(key);

  if (error instanceof ApiError) {
    const payload = error.payload;
    const errorObject =
      payload && typeof payload === "object"
        ? (payload as { error?: { message?: unknown; code?: unknown } }).error
        : undefined;

    const apiMessage =
      typeof errorObject?.message === "string" ? errorObject.message : null;
    const apiCode =
      typeof errorObject?.code === "string" ? errorObject.code : null;

    switch (apiCode) {
      case "INVENTORY_VERSION_MISMATCH":
        return t("inventory.errors.versionMismatch");
      case "INVENTORY_RATE_LIMITED":
        return t("inventory.errors.rateLimited");
      default:
        return apiMessage ?? t("inventory.errors.requestFailed");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return t("inventory.errors.requestFailed");
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

function isVersionMismatchError(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 412) {
    return true;
  }

  return resolveErrorCode(error) === "INVENTORY_VERSION_MISMATCH";
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
