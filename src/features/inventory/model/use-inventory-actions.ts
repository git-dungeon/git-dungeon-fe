import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { i18next } from "@/shared/i18n/i18n";
import type { AppError } from "@/shared/errors/app-error";
import { normalizeError } from "@/shared/errors/normalize-error";
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
import {
  isInventoryErrorCode,
  type InventoryErrorCode,
} from "@/entities/inventory/model/error-codes";

type InventoryActionType = "equip" | "unequip" | "discard";

interface InventoryActionFailure {
  source: InventoryActionType;
  code?: InventoryErrorCode | string;
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
  const [syncCounter, setSyncCounter] = useState(0);
  const isSyncing = syncCounter > 0;
  const syncPromiseRef = useRef<Promise<void> | null>(null);

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
    if (!syncPromiseRef.current) {
      syncPromiseRef.current = Promise.all([
        queryClient.refetchQueries({ queryKey: INVENTORY_QUERY_KEY }),
        queryClient.refetchQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY }),
      ])
        .then(() => undefined)
        .finally(() => {
          syncPromiseRef.current = null;
        });
    }

    await syncPromiseRef.current;
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

      setSyncCounter((current) => current + 1);
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
        setSyncCounter((current) => Math.max(0, current - 1));
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
    maxHp: 0,
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

  bonus.maxHp += bonus.hp;

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
    maxHp: summary.total.maxHp - summary.equipmentBonus.maxHp,
    atk: summary.total.atk - summary.equipmentBonus.atk,
    def: summary.total.def - summary.equipmentBonus.def,
    luck: summary.total.luck - summary.equipmentBonus.luck,
  };
}

function buildActionFailure(
  source: InventoryActionType,
  error: unknown
): InventoryActionFailure {
  const appError = normalizeError(error);
  const message = resolveInventoryActionMessage(appError);
  const normalizedError =
    error instanceof Error
      ? new Error(message)
      : new Error(String(error ?? "Unknown error"));

  return {
    source,
    code: resolveErrorCode(appError),
    error: normalizedError,
  };
}

function resolveErrorCode(
  error: AppError
): InventoryErrorCode | string | undefined {
  const payload = extractApiErrorPayload(error);
  const apiCode =
    payload && typeof payload === "object"
      ? (payload as { error?: { code?: unknown } }).error?.code
      : undefined;

  if (isInventoryErrorCode(apiCode)) {
    return apiCode;
  }

  return error.code;
}

function resolveInventoryActionMessage(error: AppError): string {
  const t = (key: string) => i18next.t(key);

  const payload = extractApiErrorPayload(error);
  const errorObject =
    payload && typeof payload === "object"
      ? (payload as { error?: { message?: unknown; code?: unknown } }).error
      : undefined;

  const apiMessage =
    typeof errorObject?.message === "string" ? errorObject.message : null;
  const apiCode = isInventoryErrorCode(errorObject?.code)
    ? errorObject.code
    : null;

  switch (apiCode) {
    case "INVENTORY_VERSION_MISMATCH":
      return t("inventory.errors.versionMismatch");
    case "INVENTORY_RATE_LIMITED":
      return t("inventory.errors.rateLimited");
    default:
      return apiMessage ?? t("inventory.errors.requestFailed");
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
  const appError = normalizeError(error);
  if (appError.code === "API_PRECONDITION_FAILED") {
    return true;
  }

  return resolveErrorCode(appError) === "INVENTORY_VERSION_MISMATCH";
}

function extractApiErrorPayload(error: AppError): unknown {
  return error.meta?.payload ?? null;
}

function mergeBaseWithEquipment(
  base: InventoryStatValues,
  equipment: InventoryStatValues
): InventoryStatValues {
  return {
    hp: base.hp + equipment.hp,
    maxHp: base.maxHp + equipment.maxHp,
    atk: base.atk + equipment.atk,
    def: base.def + equipment.def,
    luck: base.luck + equipment.luck,
  };
}
