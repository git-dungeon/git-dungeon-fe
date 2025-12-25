import { describe, expect, it } from "vitest";
import { http } from "msw";
import { ApiError } from "@/shared/api/http-client";
import { respondWithError } from "@/mocks/lib/api-response";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import { server } from "@/mocks/tests/server";
import { getInventory } from "./get-inventory";
import { postInventoryDiscard } from "./post-inventory-discard";
import { postInventoryEquip } from "./post-inventory-equip";
import { postInventoryUnequip } from "./post-inventory-unequip";

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
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(412);
      const payload = (error as ApiError).payload as
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
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(409);
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
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(409);
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
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(429);
      const payload = (error as ApiError).payload as
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
});
