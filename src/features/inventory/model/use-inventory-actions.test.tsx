import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import { ApiError } from "@/shared/api/http-client";
import { useInventoryActions } from "./use-inventory-actions";

vi.mock("@/entities/inventory/api/post-inventory-equip", () => ({
  postInventoryEquip: vi.fn(),
}));

vi.mock("@/entities/inventory/api/post-inventory-unequip", () => ({
  postInventoryUnequip: vi.fn(),
}));

vi.mock("@/entities/inventory/api/post-inventory-discard", () => ({
  postInventoryDiscard: vi.fn(),
}));

const equipModule = await import(
  "@/entities/inventory/api/post-inventory-equip"
);
const unequipModule = await import(
  "@/entities/inventory/api/post-inventory-unequip"
);
const discardModule = await import(
  "@/entities/inventory/api/post-inventory-discard"
);

const postInventoryEquipMock = vi.mocked(equipModule.postInventoryEquip);
const postInventoryUnequipMock = vi.mocked(unequipModule.postInventoryUnequip);
const postInventoryDiscardMock = vi.mocked(discardModule.postInventoryDiscard);

const inventoryFixture: InventoryResponse = {
  version: 1,
  items: [
    {
      id: "item-1",
      code: "weapon-1",
      name: "테스트 무기",
      slot: "weapon",
      rarity: "common",
      modifiers: [],
      effect: null,
      sprite: null,
      createdAt: "2025-12-31T00:00:00.000Z",
      isEquipped: false,
      version: 1,
    },
  ],
  equipped: {
    helmet: null,
    armor: null,
    weapon: null,
    ring: null,
    consumable: null,
  },
  summary: {
    base: { hp: 10, atk: 10, def: 10, luck: 10 },
    total: { hp: 10, atk: 10, def: 10, luck: 10 },
    equipmentBonus: { hp: 0, atk: 0, def: 0, luck: 0 },
  },
};

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  vi.clearAllMocks();
});

function renderWithQueryClient(ui: React.ReactElement, client: QueryClient) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
      </StrictMode>
    );
  });
  return {
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function renderInventoryActions(queryClient: QueryClient) {
  let hookResult: ReturnType<typeof useInventoryActions>;

  function HookWrapper() {
    hookResult = useInventoryActions();
    return null;
  }

  const mounted = renderWithQueryClient(<HookWrapper />, queryClient);

  return {
    get result() {
      return hookResult!;
    },
    unmount: mounted.unmount,
  };
}

describe("useInventoryActions", () => {
  it("동시 재시도 시 refetchQueries를 한 번만 수행한다", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(INVENTORY_QUERY_KEY, inventoryFixture);
    queryClient.setQueryData(DASHBOARD_STATE_QUERY_KEY, {
      version: 1,
    });

    const refetchSpy = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue(undefined);

    let callCount = 0;
    const mismatchError = new ApiError("version mismatch", 412, {
      error: { code: "INVENTORY_VERSION_MISMATCH" },
    });

    postInventoryEquipMock.mockImplementation(async () => {
      callCount += 1;
      if (callCount <= 2) {
        throw mismatchError;
      }
      return inventoryFixture;
    });

    postInventoryUnequipMock.mockResolvedValue(inventoryFixture);
    postInventoryDiscardMock.mockResolvedValue(inventoryFixture);

    const { result, unmount } = renderInventoryActions(queryClient);

    await act(async () => {
      await Promise.all([result.equip("item-1"), result.equip("item-1")]);
    });

    expect(refetchSpy).toHaveBeenCalledTimes(2);
    const calledKeys = refetchSpy.mock.calls.map(
      ([options]) => options?.queryKey
    );
    expect(calledKeys).toEqual(
      expect.arrayContaining([INVENTORY_QUERY_KEY, DASHBOARD_STATE_QUERY_KEY])
    );

    unmount();
  });
});
