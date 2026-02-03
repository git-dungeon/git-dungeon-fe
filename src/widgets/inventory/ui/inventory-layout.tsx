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
import {
  filterInventoryItems,
  sortItemsByAcquiredAt,
  sortItemsByDefault,
} from "@/widgets/inventory/lib/inventory-filters";
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
  onDiscard: (itemId: string, quantity?: number) => Promise<unknown>;
  onDismantle: (itemId: string) => Promise<unknown>;
  onEnhance: (itemId: string) => Promise<unknown>;
  dismantleError: Error | null;
  enhanceError: Error | null;
  onClearError: () => void;
  gold: number;
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
  onDismantle,
  onEnhance,
  dismantleError,
  enhanceError,
  onClearError,
  gold,
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

  const selectedItem = selectedItemId
    ? (items.find((item) => item.id === selectedItemId) ?? null)
    : null;

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

  const filteredItems = useMemo(
    () =>
      filterInventoryItems(items, {
        equippedFilter,
        selectedSlots,
        selectedRarities,
        dateRange,
      }),
    [items, equippedFilter, selectedSlots, selectedRarities, dateRange]
  );
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
        onDismantle={onDismantle}
        onEnhance={onEnhance}
        onClearError={onClearError}
        dismantleError={dismantleError}
        enhanceError={enhanceError}
        items={items}
        gold={gold}
      />
    </div>
  );
}
