import { useEffect, useMemo, useState } from "react";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryItemSlot,
  EquipmentRarity,
} from "@/entities/inventory/model/types";
import { InventorySlots } from "@/widgets/inventory/ui/inventory-slots";
import { InventoryCharacterPanel } from "@/widgets/inventory/ui/inventory-character-panel";
import { InventoryGrid } from "@/widgets/inventory/ui/inventory-grid";
import {
  InventoryFiltersPanel,
  type InventoryDateRange,
  type InventoryEquippedFilter,
  type InventorySortFilter,
} from "@/widgets/inventory/ui/inventory-filters-panel";
import { InventoryModal } from "@/widgets/inventory/ui/inventory-modal";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";

interface InventoryLayoutProps {
  items: InventoryItem[];
  equipped: InventoryEquippedMap;
  stats: CharacterStatSummary;
  level: number;
  avatarUrl?: string | null;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string) => Promise<unknown>;
  onClearError: () => void;
}

export function InventoryLayout({
  items,
  equipped,
  stats,
  level,
  avatarUrl,
  isPending,
  isSyncing,
  error,
  onEquip,
  onUnequip,
  onDiscard,
  onClearError,
}: InventoryLayoutProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InventoryItemSlot | null>(
    null
  );
  const [equippedFilter, setEquippedFilter] =
    useState<InventoryEquippedFilter>("ALL");
  const [sortFilter, setSortFilter] = useState<InventorySortFilter>("DEFAULT");
  const [selectedSlots, setSelectedSlots] = useState<InventoryItemSlot[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<EquipmentRarity[]>(
    []
  );
  const [dateRange, setDateRange] = useState<InventoryDateRange>({
    start: "",
    end: "",
  });

  const selectedItem = useMemo(() => {
    if (!selectedItemId) {
      return null;
    }

    return items.find((item) => item.id === selectedItemId) ?? null;
  }, [items, selectedItemId]);

  const handleSelect = (item: InventoryItem, slot: InventoryItemSlot) => {
    onClearError();
    setSelectedItemId(item.id);
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    onClearError();
    setSelectedItemId(null);
    setSelectedSlot(null);
  };

  const filteredItems = filterInventoryItems(items, {
    equippedFilter,
    selectedSlots,
    selectedRarities,
    dateRange,
  });
  const resolvedItems =
    sortFilter === "DEFAULT"
      ? sortItemsByDefault(filteredItems)
      : sortItemsByAcquiredAt(filteredItems, sortFilter);

  useEffect(() => {
    if (!selectedItemId) {
      return;
    }
    const exists = filteredItems.some((item) => item.id === selectedItemId);
    if (!exists) {
      setSelectedItemId(null);
      setSelectedSlot(null);
    }
  }, [filteredItems, selectedItemId]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <InventorySlots
          equipped={equipped}
          selectedItemId={selectedItemId}
          onSelect={handleSelect}
        />
        <InventoryCharacterPanel
          stats={stats}
          level={level}
          avatarUrl={avatarUrl}
        />
      </div>

      <InventoryFiltersPanel
        equippedFilter={equippedFilter}
        sortFilter={sortFilter}
        selectedSlots={selectedSlots}
        selectedRarities={selectedRarities}
        dateRange={dateRange}
        onEquippedChange={setEquippedFilter}
        onSortChange={setSortFilter}
        onSlotsChange={setSelectedSlots}
        onRaritiesChange={setSelectedRarities}
        onDateRangeChange={setDateRange}
      />

      <InventoryGrid
        items={resolvedItems}
        selectedItemId={selectedItemId}
        onSelect={(item) => handleSelect(item, item.slot)}
      />

      <InventoryModal
        item={selectedItem}
        slot={selectedSlot}
        isPending={isPending}
        isSyncing={isSyncing}
        error={error}
        onClose={handleCloseModal}
        onEquip={onEquip}
        onUnequip={onUnequip}
        onDiscard={onDiscard}
      />
    </div>
  );
}

interface InventoryFilterState {
  equippedFilter: InventoryEquippedFilter;
  selectedSlots: InventoryItemSlot[];
  selectedRarities: EquipmentRarity[];
  dateRange: InventoryDateRange;
}

function filterInventoryItems(
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

function sortItemsByAcquiredAt(
  items: InventoryItem[],
  sortFilter: InventorySortFilter
) {
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sortFilter === "ACQUIRED_DESC" ? sorted.reverse() : sorted;
}

const SLOT_ORDER: Record<InventoryItemSlot, number> = {
  helmet: 0,
  armor: 1,
  weapon: 2,
  ring: 3,
  consumable: 4,
};

function sortItemsByDefault(items: InventoryItem[]) {
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

function isWithinDateRange(value: string, range: InventoryDateRange) {
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
