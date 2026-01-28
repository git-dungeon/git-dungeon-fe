import { describe, expect, it } from "vitest";
import {
  buildDismantlePreview,
  canDismantleItem,
} from "@/widgets/inventory/lib/dismantle-preview";

describe("dismantle-preview", () => {
  describe("buildDismantlePreview", () => {
    it("weapon/희귀도에 따라 재료 코드와 수량을 반환한다", () => {
      const result = buildDismantlePreview({
        id: "item-1",
        code: "weapon-test",
        name: null,
        slot: "weapon",
        rarity: "epic",
        modifiers: [],
        effect: null,
        sprite: null,
        createdAt: "2026-01-28T00:00:00.000Z",
        isEquipped: false,
        quantity: 1,
        version: 1,
      });

      expect(result).toEqual([
        {
          code: "material-metal-scrap",
          quantity: 4,
        },
      ]);
    });

    it("consumable/material 슬롯은 빈 결과를 반환한다", () => {
      const result = buildDismantlePreview({
        id: "item-2",
        code: "material-metal-scrap",
        name: null,
        slot: "material",
        rarity: "common",
        modifiers: [],
        effect: null,
        sprite: null,
        createdAt: "2026-01-28T00:00:00.000Z",
        isEquipped: false,
        quantity: 7,
        version: 1,
      });

      expect(result).toEqual([]);
    });
  });

  describe("canDismantleItem", () => {
    it("장착 중인 아이템은 분해 불가", () => {
      expect(
        canDismantleItem({
          id: "item-3",
          code: "weapon-test",
          name: null,
          slot: "weapon",
          rarity: "common",
          modifiers: [],
          effect: null,
          sprite: null,
          createdAt: "2026-01-28T00:00:00.000Z",
          isEquipped: true,
          quantity: 1,
          version: 1,
        })
      ).toBe(false);
    });

    it("장착 중이 아니고 대상 슬롯(helmet/armor/weapon/ring)이면 분해 가능", () => {
      expect(
        canDismantleItem({
          id: "item-4",
          code: "ring-test",
          name: null,
          slot: "ring",
          rarity: "legendary",
          modifiers: [],
          effect: null,
          sprite: null,
          createdAt: "2026-01-28T00:00:00.000Z",
          isEquipped: false,
          quantity: 1,
          version: 1,
        })
      ).toBe(true);
    });

    it("consumable/material 슬롯은 분해 불가", () => {
      expect(
        canDismantleItem({
          id: "item-5",
          code: "material-metal-scrap",
          name: null,
          slot: "material",
          rarity: "common",
          modifiers: [],
          effect: null,
          sprite: null,
          createdAt: "2026-01-28T00:00:00.000Z",
          isEquipped: false,
          quantity: 10,
          version: 1,
        })
      ).toBe(false);
    });
  });
});
