import { describe, expect, it } from "vitest";
import {
  filterInventoryItems,
  isWithinDateRange,
  sortItemsByAcquiredAt,
  sortItemsByDefault,
  type InventoryFilterState,
} from "@/widgets/inventory/lib/inventory-filters";
import type { InventoryItem } from "@/entities/inventory/model/types";

const baseItems: InventoryItem[] = [
  {
    id: "item-1",
    code: "helmet-iron",
    name: "Iron Helm",
    slot: "helmet",
    rarity: "common",
    modifiers: [],
    effect: null,
    sprite: null,
    createdAt: "2026-01-10T10:00:00.000Z",
    isEquipped: true,
    quantity: 1,
    version: 1,
  },
  {
    id: "item-2",
    code: "weapon-sword",
    name: "Sword",
    slot: "weapon",
    rarity: "rare",
    modifiers: [],
    effect: null,
    sprite: null,
    createdAt: "2026-01-12T10:00:00.000Z",
    isEquipped: false,
    quantity: 1,
    version: 1,
  },
  {
    id: "item-3",
    code: "ring-gold",
    name: "Gold Ring",
    slot: "ring",
    rarity: "epic",
    modifiers: [],
    effect: null,
    sprite: null,
    createdAt: "2026-01-11T10:00:00.000Z",
    isEquipped: false,
    quantity: 1,
    version: 1,
  },
];

const defaultFilterState: InventoryFilterState = {
  equippedFilter: "ALL",
  selectedSlots: [],
  selectedRarities: [],
  dateRange: {
    start: "",
    end: "",
  },
};

describe("inventory-filters", () => {
  describe("filterInventoryItems", () => {
    it("filters by equipped state", () => {
      const equippedOnly = filterInventoryItems(baseItems, {
        ...defaultFilterState,
        equippedFilter: "EQUIPPED",
      });

      expect(equippedOnly).toHaveLength(1);
      expect(equippedOnly[0]?.id).toBe("item-1");
    });

    it("filters by slots", () => {
      const filtered = filterInventoryItems(baseItems, {
        ...defaultFilterState,
        selectedSlots: ["weapon"],
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.id).toBe("item-2");
    });

    it("filters by rarities", () => {
      const filtered = filterInventoryItems(baseItems, {
        ...defaultFilterState,
        selectedRarities: ["epic"],
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.id).toBe("item-3");
    });

    it("filters by date range", () => {
      const filtered = filterInventoryItems(baseItems, {
        ...defaultFilterState,
        dateRange: {
          start: "2026-01-11",
          end: "2026-01-12",
        },
      });

      expect(filtered.map((item) => item.id)).toEqual(["item-2", "item-3"]);
    });
  });

  describe("sortItemsByDefault", () => {
    it("sorts equipped first, then slot order, then acquired desc", () => {
      const sorted = sortItemsByDefault(baseItems);
      expect(sorted.map((item) => item.id)).toEqual([
        "item-1",
        "item-2",
        "item-3",
      ]);
    });
  });

  describe("sortItemsByAcquiredAt", () => {
    it("sorts by acquired asc", () => {
      const sorted = sortItemsByAcquiredAt(baseItems, "ACQUIRED_ASC");
      expect(sorted.map((item) => item.id)).toEqual([
        "item-1",
        "item-3",
        "item-2",
      ]);
    });

    it("sorts by acquired desc", () => {
      const sorted = sortItemsByAcquiredAt(baseItems, "ACQUIRED_DESC");
      expect(sorted.map((item) => item.id)).toEqual([
        "item-2",
        "item-3",
        "item-1",
      ]);
    });
  });

  describe("isWithinDateRange", () => {
    it("returns true when range is empty", () => {
      expect(
        isWithinDateRange("2026-01-10T10:00:00.000Z", {
          start: "",
          end: "",
        })
      ).toBe(true);
    });

    it("returns false for invalid date", () => {
      expect(
        isWithinDateRange("invalid-date", {
          start: "2026-01-10",
          end: "2026-01-11",
        })
      ).toBe(false);
    });
  });
});
