import { describe, expect, it } from "vitest";
import { http } from "msw";
import { isAppError } from "@/shared/errors/app-error";
import { respondWithError } from "@/mocks/lib/api-response";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { server } from "@/mocks/tests/server";
import { getInventory } from "./get-inventory";
import { postInventoryDiscard } from "./post-inventory-discard";
import { postInventoryDismantle } from "./post-inventory-dismantle";
import { postInventoryEquip } from "./post-inventory-equip";
import { postInventoryEnhance } from "./post-inventory-enhance";
import { postInventoryUnequip } from "./post-inventory-unequip";
import { getDashboardState } from "@/entities/dashboard/api/get-dashboard-state";

describe("inventory actions", () => {
  it("버전이 불일치하면 412 INVENTORY_VERSION_MISMATCH로 처리된다", async () => {
    const inventory = await getInventory();
    const target = inventory.items.find((item) => !item.isEquipped);

    expect(target).toBeTruthy();

    try {
      await postInventoryEquip({
        itemId: target!.id,
        expectedVersion: target!.version + 1,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryEquip to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_PRECONDITION_FAILED");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_VERSION_MISMATCH");
    }
  });

  it("이미 장착된 아이템을 다시 장착하면 409로 처리된다", async () => {
    const inventory = await getInventory();
    const target = inventory.items.find((item) => item.isEquipped);

    expect(target).toBeTruthy();

    try {
      await postInventoryEquip({
        itemId: target!.id,
        expectedVersion: target!.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryEquip to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_CONFLICT");
    }
  });

  it("장착되지 않은 아이템을 해제하면 409로 처리된다", async () => {
    const inventory = await getInventory();
    const target = inventory.items.find((item) => !item.isEquipped);

    expect(target).toBeTruthy();

    try {
      await postInventoryUnequip({
        itemId: target!.id,
        expectedVersion: target!.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryUnequip to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_CONFLICT");
    }
  });

  it("429 응답은 INVENTORY_RATE_LIMITED 코드가 포함된다", async () => {
    server.use(
      http.post(INVENTORY_ENDPOINTS.equip, () =>
        respondWithError("요청이 너무 많습니다.", {
          status: 429,
          code: "INVENTORY_RATE_LIMITED",
        })
      )
    );

    const inventory = await getInventory();
    const target = inventory.items[0]!;

    try {
      await postInventoryEquip({
        itemId: target.id,
        expectedVersion: target.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryEquip to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_RATE_LIMIT");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_RATE_LIMITED");
    }
  });

  it("분해 400 응답은 INVENTORY_INVALID_REQUEST 코드가 포함된다", async () => {
    server.use(
      http.post(INVENTORY_ENDPOINTS.dismantle, () =>
        respondWithError("요청 정보가 올바르지 않습니다.", {
          status: 400,
          code: "INVENTORY_INVALID_REQUEST",
        })
      )
    );

    const inventory = await getInventory();
    const target = inventory.items[0]!;

    try {
      await postInventoryDismantle({
        itemId: target.id,
        expectedVersion: target.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryDismantle to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_BAD_REQUEST");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_INVALID_REQUEST");
    }
  });

  it("분해 404 응답은 INVENTORY_ITEM_NOT_FOUND 코드가 포함된다", async () => {
    server.use(
      http.post(INVENTORY_ENDPOINTS.dismantle, () =>
        respondWithError("아이템을 찾을 수 없습니다.", {
          status: 404,
          code: "INVENTORY_ITEM_NOT_FOUND",
        })
      )
    );

    const inventory = await getInventory();
    const target = inventory.items[0]!;

    try {
      await postInventoryDismantle({
        itemId: target.id,
        expectedVersion: target.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryDismantle to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_NOT_FOUND");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_ITEM_NOT_FOUND");
    }
  });

  it("분해 409 응답은 INVENTORY_SLOT_CONFLICT 코드가 포함된다", async () => {
    server.use(
      http.post(INVENTORY_ENDPOINTS.dismantle, () =>
        respondWithError("장착 중인 아이템은 분해할 수 없습니다.", {
          status: 409,
          code: "INVENTORY_SLOT_CONFLICT",
        })
      )
    );

    const inventory = await getInventory();
    const target = inventory.items[0]!;

    try {
      await postInventoryDismantle({
        itemId: target.id,
        expectedVersion: target.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryDismantle to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_CONFLICT");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_SLOT_CONFLICT");
    }
  });

  it("분해 429 응답은 INVENTORY_RATE_LIMITED 코드가 포함된다", async () => {
    server.use(
      http.post(INVENTORY_ENDPOINTS.dismantle, () =>
        respondWithError("요청이 너무 많습니다.", {
          status: 429,
          code: "INVENTORY_RATE_LIMITED",
        })
      )
    );

    const inventory = await getInventory();
    const target = inventory.items[0]!;

    try {
      await postInventoryDismantle({
        itemId: target.id,
        expectedVersion: target.version,
        inventoryVersion: inventory.version,
      });
      throw new Error("Expected postInventoryDismantle to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_RATE_LIMIT");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("INVENTORY_RATE_LIMITED");
    }
  });

  it("폐기 성공 시 인벤토리 버전이 증가하고 아이템이 제거된다", async () => {
    const inventory = await getInventory();
    const target = inventory.items.find((item) => !item.isEquipped);

    expect(target).toBeTruthy();

    const next = await postInventoryDiscard({
      itemId: target!.id,
      expectedVersion: target!.version,
      inventoryVersion: inventory.version,
    });

    expect(next.version).toBe(inventory.version + 1);
    expect(next.items.some((item) => item.id === target!.id)).toBe(false);
  });

  it("분해 성공 시 재료가 추가되고 아이템이 제거된다", async () => {
    const inventory = await getInventory();
    const target = inventory.items.find(
      (item) =>
        !item.isEquipped &&
        ["helmet", "armor", "weapon", "ring"].includes(item.slot)
    );

    expect(target).toBeTruthy();

    const next = await postInventoryDismantle({
      itemId: target!.id,
      expectedVersion: target!.version,
      inventoryVersion: inventory.version,
    });

    const materialBySlot: Record<string, string> = {
      helmet: "material-leather-scrap",
      armor: "material-cloth-scrap",
      weapon: "material-metal-scrap",
      ring: "material-mithril-dust",
    };
    const quantityByRarity: Record<string, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
    };

    const expectedMaterial = materialBySlot[target!.slot];
    const rarity = target!.rarity ?? "common";
    const materialBefore = inventory.items.find(
      (item) => item.code === expectedMaterial && item.slot === "material"
    );
    const materialItem = next.items.find(
      (item) => item.code === expectedMaterial && item.slot === "material"
    );

    expect(next.version).toBe(inventory.version + 1);
    expect(next.items.some((item) => item.id === target!.id)).toBe(false);
    expect(materialItem).toBeTruthy();
    expect(materialItem?.quantity).toBe(
      (materialBefore?.quantity ?? 0) + quantityByRarity[rarity]
    );
  });

  it("강화 성공 시 강화 레벨이 증가하고 골드/재료가 감소한다", async () => {
    const dashboardBefore = await getDashboardState();
    const inventory = await getInventory();
    const target = inventory.items.find((item) =>
      ["helmet", "armor", "weapon", "ring"].includes(item.slot)
    );

    expect(target).toBeTruthy();

    const materialBySlot: Record<string, string> = {
      helmet: "material-leather-scrap",
      armor: "material-cloth-scrap",
      weapon: "material-metal-scrap",
      ring: "material-mithril-dust",
    };
    const expectedMaterial = materialBySlot[target!.slot];
    const materialBefore = inventory.items.find(
      (item) => item.slot === "material" && item.code === expectedMaterial
    );

    expect(materialBefore).toBeTruthy();

    const next = await postInventoryEnhance({
      itemId: target!.id,
      expectedVersion: target!.version,
      inventoryVersion: inventory.version,
    });

    const updated = next.items.find((item) => item.id === target!.id);
    const materialAfter = next.items.find(
      (item) => item.slot === "material" && item.code === expectedMaterial
    );

    expect(next.version).toBe(inventory.version + 1);
    expect(updated?.enhancementLevel ?? 0).toBe(
      (target!.enhancementLevel ?? 0) + 1
    );
    expect(materialAfter?.quantity).toBe((materialBefore?.quantity ?? 1) - 1);

    const dashboardAfter = await getDashboardState();
    expect(dashboardAfter.gold).toBe(dashboardBefore.gold - 5);
  });
});
