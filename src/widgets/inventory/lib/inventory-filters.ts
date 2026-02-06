import type {
  EquipmentRarity,
  InventoryItem,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import type {
  InventoryDateRange,
  InventoryEquippedFilter,
  InventorySortFilter,
} from "@/widgets/inventory/model/types";

export interface InventoryFilterState {
  equippedFilter: InventoryEquippedFilter;
  selectedSlots: InventoryItemSlot[];
  selectedRarities: EquipmentRarity[];
  dateRange: InventoryDateRange;
}

const SLOT_ORDER: Record<InventoryItemSlot, number> = {
  helmet: 0,
  armor: 1,
  weapon: 2,
  ring: 3,
  consumable: 4,
  material: 5,
};

export function filterInventoryItems(
  items: InventoryItem[],
  {
    equippedFilter,
    selectedSlots,
    selectedRarities,
    dateRange,
  }: InventoryFilterState
) {
  return items.filter((item) => {
    if (equippedFilter === "EQUIPPED" && !item.isEquipped) {
      return false;
    }
    if (equippedFilter === "UNEQUIPPED" && item.isEquipped) {
      return false;
    }
    if (selectedSlots.length > 0 && !selectedSlots.includes(item.slot)) {
      return false;
    }
    if (
      selectedRarities.length > 0 &&
      !selectedRarities.includes(item.rarity)
    ) {
      return false;
    }
    if (!isWithinDateRange(item.createdAt, dateRange)) {
      return false;
    }
    return true;
  });
}

export function sortItemsByAcquiredAt(
  items: InventoryItem[],
  sortFilter: InventorySortFilter
) {
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sortFilter === "ACQUIRED_DESC" ? sorted.reverse() : sorted;
}

export function sortItemsByDefault(items: InventoryItem[]) {
  return [...items].sort((a, b) => {
    if (a.isEquipped !== b.isEquipped) {
      return a.isEquipped ? -1 : 1;
    }

    if (SLOT_ORDER[a.slot] !== SLOT_ORDER[b.slot]) {
      return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot];
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function isWithinDateRange(value: string, range: InventoryDateRange) {
  const { start, end } = range;
  if (!start && !end) {
    return true;
  }
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return false;
  }
  if (start) {
    const startTime = new Date(`${start}T00:00:00`).getTime();
    if (timestamp < startTime) {
      return false;
    }
  }
  if (end) {
    const endTime = new Date(`${end}T23:59:59.999`).getTime();
    if (timestamp > endTime) {
      return false;
    }
  }
  return true;
}
