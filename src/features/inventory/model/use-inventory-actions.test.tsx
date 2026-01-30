import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import { ApiError } from "@/shared/api/http-client";
import { i18next } from "@/shared/i18n/i18n";
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

vi.mock("@/entities/inventory/api/post-inventory-dismantle", () => ({
  postInventoryDismantle: vi.fn(),
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
const dismantleModule = await import(
  "@/entities/inventory/api/post-inventory-dismantle"
);

const postInventoryEquipMock = vi.mocked(equipModule.postInventoryEquip);
const postInventoryUnequipMock = vi.mocked(unequipModule.postInventoryUnequip);
const postInventoryDiscardMock = vi.mocked(discardModule.postInventoryDiscard);
const postInventoryDismantleMock = vi.mocked(
  dismantleModule.postInventoryDismantle
);

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
      quantity: 1,
      version: 1,
    },
  ],
  equipped: {
    helmet: null,
    armor: null,
    weapon: null,
    ring: null,
    consumable: null,
    material: null,
  },
  summary: {
    base: { hp: 10, maxHp: 10, atk: 10, def: 10, luck: 10 },
    total: { hp: 10, maxHp: 10, atk: 10, def: 10, luck: 10 },
    equipmentBonus: { hp: 0, maxHp: 0, atk: 0, def: 0, luck: 0 },
  },
};

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  void i18next.changeLanguage("ko");
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

    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
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
    postInventoryDismantleMock.mockResolvedValue(inventoryFixture);

    const actions = renderInventoryActions(queryClient);

    await act(async () => {
      await Promise.all([
        actions.result.equip("item-1"),
        actions.result.equip("item-1"),
      ]);
    });

    expect(refetchSpy).toHaveBeenCalledTimes(2);
    const calledKeys = refetchSpy.mock.calls.map(
      ([options]) => options?.queryKey
    );
    expect(calledKeys).toEqual(
      expect.arrayContaining([INVENTORY_QUERY_KEY, DASHBOARD_STATE_QUERY_KEY])
    );

    actions.unmount();
  });

  it("dismantle도 버전 불일치 시 재시도를 수행한다", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(INVENTORY_QUERY_KEY, inventoryFixture);
    queryClient.setQueryData(DASHBOARD_STATE_QUERY_KEY, {
      version: 1,
    });

    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
    const refetchSpy = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue(undefined);

    let callCount = 0;
    const mismatchError = new ApiError("version mismatch", 412, {
      error: { code: "INVENTORY_VERSION_MISMATCH" },
    });

    postInventoryDismantleMock.mockImplementation(async () => {
      callCount += 1;
      if (callCount <= 1) {
        throw mismatchError;
      }
      return inventoryFixture;
    });

    postInventoryEquipMock.mockResolvedValue(inventoryFixture);
    postInventoryUnequipMock.mockResolvedValue(inventoryFixture);
    postInventoryDiscardMock.mockResolvedValue(inventoryFixture);

    const actions = renderInventoryActions(queryClient);

    await act(async () => {
      await actions.result.dismantle("item-1");
    });

    expect(refetchSpy).toHaveBeenCalledTimes(2);
    const calledKeys = refetchSpy.mock.calls.map(
      ([options]) => options?.queryKey
    );
    expect(calledKeys).toEqual(
      expect.arrayContaining([INVENTORY_QUERY_KEY, DASHBOARD_STATE_QUERY_KEY])
    );

    actions.unmount();
  });

  it.each([
    {
      apiCode: "INVENTORY_INVALID_REQUEST",
      status: 400,
      expectedMessage: "요청 정보가 올바르지 않습니다.",
    },
    {
      apiCode: "INVENTORY_ITEM_NOT_FOUND",
      status: 404,
      expectedMessage: "아이템을 찾을 수 없습니다.",
    },
    {
      apiCode: "INVENTORY_SLOT_CONFLICT",
      status: 409,
      expectedMessage: "장착 중인 아이템은 분해할 수 없습니다.",
    },
    {
      apiCode: "INVENTORY_RATE_LIMITED",
      status: 429,
      expectedMessage: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    },
  ])(
    "dismantle 오류($apiCode)는 사용자 메시지로 매핑된다",
    async ({ apiCode, status, expectedMessage }) => {
      const queryClient = new QueryClient();
      queryClient.setQueryData(INVENTORY_QUERY_KEY, inventoryFixture);
      queryClient.setQueryData(DASHBOARD_STATE_QUERY_KEY, {
        version: 1,
      });

      vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);

      postInventoryDismantleMock.mockRejectedValueOnce(
        new ApiError("error", status, { error: { code: apiCode } })
      );
      postInventoryEquipMock.mockResolvedValue(inventoryFixture);
      postInventoryUnequipMock.mockResolvedValue(inventoryFixture);
      postInventoryDiscardMock.mockResolvedValue(inventoryFixture);

      const actions = renderInventoryActions(queryClient);

      await act(async () => {
        try {
          await actions.result.dismantle("item-1");
        } catch {
          // noop
        }
      });

      expect(actions.result.errorMap.dismantle?.error.message).toBe(
        expectedMessage
      );

      actions.unmount();
    }
  );

  it("dismantle 버전 불일치가 재시도 후에도 지속되면 versionMismatch 메시지를 표시한다", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(INVENTORY_QUERY_KEY, inventoryFixture);
    queryClient.setQueryData(DASHBOARD_STATE_QUERY_KEY, {
      version: 1,
    });

    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
    vi.spyOn(queryClient, "refetchQueries").mockResolvedValue(undefined);

    const mismatchError = new ApiError("version mismatch", 412, {
      error: { code: "INVENTORY_VERSION_MISMATCH" },
    });

    postInventoryDismantleMock.mockRejectedValue(mismatchError);
    postInventoryEquipMock.mockResolvedValue(inventoryFixture);
    postInventoryUnequipMock.mockResolvedValue(inventoryFixture);
    postInventoryDiscardMock.mockResolvedValue(inventoryFixture);

    const actions = renderInventoryActions(queryClient);

    await act(async () => {
      try {
        await actions.result.dismantle("item-1");
      } catch {
        // noop
      }
    });

    expect(actions.result.errorMap.dismantle?.error.message).toBe(
      "인벤토리 상태가 변경되었습니다. 새로고침 후 다시 시도해 주세요."
    );

    actions.unmount();
  });
});
