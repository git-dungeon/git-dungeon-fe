import { useMemo, useState } from "react";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import { InventorySlots } from "@/widgets/inventory/ui/inventory-slots";
import { InventoryCharacterPanel } from "@/widgets/inventory/ui/inventory-character-panel";
import { InventoryGrid } from "@/widgets/inventory/ui/inventory-grid";
import { InventoryModal } from "@/widgets/inventory/ui/inventory-modal";
// import { HintCard } from "@/entities/inventory/ui/hint-card";
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

      <InventoryGrid
        items={items}
        selectedItemId={selectedItemId}
        onSelect={(item) => handleSelect(item, item.slot)}
      />

      {/* <HintCard /> */}

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
