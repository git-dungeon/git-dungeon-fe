import { useMemo, useState } from "react";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventorySummary,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { InventorySlots } from "@/widgets/inventory/ui/inventory-slots";
import { InventoryCharacterPanel } from "@/widgets/inventory/ui/inventory-character-panel";
import { InventoryGrid } from "@/widgets/inventory/ui/inventory-grid";
import { InventoryModal } from "@/widgets/inventory/ui/inventory-modal";

interface InventoryLayoutProps {
  items: InventoryItem[];
  equipped: InventoryEquippedMap;
  summary: InventorySummary;
  isPending: boolean;
  error: Error | null;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string) => Promise<unknown>;
}

export function InventoryLayout({
  items,
  equipped,
  summary,
  isPending,
  error,
  onEquip,
  onUnequip,
  onDiscard,
}: InventoryLayoutProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);

  const selectedItem = useMemo(() => {
    if (!selectedItemId) {
      return null;
    }

    return items.find((item) => item.id === selectedItemId) ?? null;
  }, [items, selectedItemId]);

  const handleSelect = (item: InventoryItem, slot: EquipmentSlot) => {
    setSelectedItemId(item.id);
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedItemId(null);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <InventorySlots
          equipped={equipped}
          selectedItemId={selectedItemId}
          onSelect={handleSelect}
        />

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
          <InventoryCharacterPanel summary={summary} />
          {renderHintCard(selectedItem)}
        </div>
      </div>

      <InventoryGrid
        items={items}
        selectedItemId={selectedItemId}
        onSelect={(item) => handleSelect(item, item.slot)}
      />

      <InventoryModal
        item={selectedItem}
        slot={selectedSlot}
        isPending={isPending}
        error={error}
        onClose={handleCloseModal}
        onEquip={onEquip}
        onUnequip={onUnequip}
        onDiscard={onDiscard}
      />
    </div>
  );
}

function renderHintCard(selectedItem: InventoryItem | null) {
  return (
    <div className="rounded-lg border-2 border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-200">
      <h2 className="text-base font-semibold text-neutral-100">Tips</h2>
      <p className="mt-2 leading-relaxed text-neutral-300">
        슬롯 또는 인벤토리 아이템을 클릭해 상세 정보를 확인하고 장착을
        변경해보세요.
        {selectedItem ? (
          <span className="block pt-2 text-xs text-neutral-400">
            현재 선택: {selectedItem.name}
          </span>
        ) : null}
      </p>
    </div>
  );
}
