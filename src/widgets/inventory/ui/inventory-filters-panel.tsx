import { useTranslation } from "react-i18next";
import type {
  EquipmentRarity,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";

const SLOT_OPTIONS: InventoryItemSlot[] = [
  "helmet",
  "armor",
  "weapon",
  "ring",
  "consumable",
];

const RARITY_OPTIONS: EquipmentRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

export type InventoryEquippedFilter = "ALL" | "EQUIPPED" | "UNEQUIPPED";
export type InventorySortFilter = "DEFAULT" | "ACQUIRED_DESC" | "ACQUIRED_ASC";

export interface InventoryDateRange {
  start: string;
  end: string;
}

interface InventoryFiltersPanelProps {
  equippedFilter: InventoryEquippedFilter;
  sortFilter: InventorySortFilter;
  selectedSlots: InventoryItemSlot[];
  selectedRarities: EquipmentRarity[];
  dateRange: InventoryDateRange;
  onEquippedChange: (value: InventoryEquippedFilter) => void;
  onSortChange: (value: InventorySortFilter) => void;
  onSlotsChange: (value: InventoryItemSlot[]) => void;
  onRaritiesChange: (value: EquipmentRarity[]) => void;
  onDateRangeChange: (value: InventoryDateRange) => void;
}

export function InventoryFiltersPanel({
  equippedFilter,
  sortFilter,
  selectedSlots,
  selectedRarities,
  dateRange,
  onEquippedChange,
  onSortChange,
  onSlotsChange,
  onRaritiesChange,
  onDateRangeChange,
}: InventoryFiltersPanelProps) {
  const { t, i18n } = useTranslation();
  const isKo = i18n.language?.startsWith("ko");
  const labels = {
    equippedLabel: isKo ? "장착 여부" : "Equipped",
    sortLabel: isKo ? "정렬" : "Sort",
    slotsLabel: isKo ? "슬롯" : "Slots",
    rarityLabel: isKo ? "희귀도" : "Rarity",
    dateLabel: isKo ? "획득일" : "Acquired",
    all: isKo ? "전체" : "All",
    equipped: isKo ? "장착" : "Equipped",
    unequipped: isKo ? "미장착" : "Unequipped",
    sortDefault: isKo ? "기본 정렬" : "Default order",
    sortNewest: isKo ? "획득일 최신" : "Newest",
    sortOldest: isKo ? "획득일 오래된" : "Oldest",
    from: isKo ? "시작" : "From",
    to: isKo ? "끝" : "To",
    hint: isKo
      ? "기간을 선택하지 않으면 전체 기간으로 표시됩니다."
      : "Leaving dates empty shows all items.",
  };

  const toggleSlot = (slot: InventoryItemSlot) => {
    const next = selectedSlots.includes(slot)
      ? selectedSlots.filter((value) => value !== slot)
      : [...selectedSlots, slot];
    onSlotsChange(next);
  };

  const toggleRarity = (rarity: EquipmentRarity) => {
    const next = selectedRarities.includes(rarity)
      ? selectedRarities.filter((value) => value !== rarity)
      : [...selectedRarities, rarity];
    onRaritiesChange(next);
  };

  return (
    <PixelPanel
      title={t("logs.filters.title")}
      className="p-4"
      contentClassName="space-y-4"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">{labels.equippedLabel}</p>
          <Select
            value={equippedFilter}
            onValueChange={(next) =>
              onEquippedChange(next as InventoryEquippedFilter)
            }
          >
            <SelectTrigger className="pixel-select-trigger w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pixel-select-content">
              <SelectItem value="ALL" className="pixel-select-item">
                {labels.all}
              </SelectItem>
              <SelectItem value="EQUIPPED" className="pixel-select-item">
                {labels.equipped}
              </SelectItem>
              <SelectItem value="UNEQUIPPED" className="pixel-select-item">
                {labels.unequipped}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">{labels.sortLabel}</p>
          <Select
            value={sortFilter}
            onValueChange={(next) => onSortChange(next as InventorySortFilter)}
          >
            <SelectTrigger className="pixel-select-trigger w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pixel-select-content">
              <SelectItem value="DEFAULT" className="pixel-select-item">
                {labels.sortDefault}
              </SelectItem>
              <SelectItem value="ACQUIRED_DESC" className="pixel-select-item">
                {labels.sortNewest}
              </SelectItem>
              <SelectItem value="ACQUIRED_ASC" className="pixel-select-item">
                {labels.sortOldest}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">{labels.slotsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {SLOT_OPTIONS.map((slot) => {
              const isActive = selectedSlots.includes(slot);
              return (
                <PixelButton
                  key={slot}
                  type="button"
                  pixelSize="compact"
                  className={cn(isActive && "pixel-button--active")}
                  onClick={() => toggleSlot(slot)}
                >
                  {getInventorySlotLabel(slot)}
                </PixelButton>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">{labels.rarityLabel}</p>
          <div className="flex flex-wrap gap-2">
            {RARITY_OPTIONS.map((rarity) => {
              const isActive = selectedRarities.includes(rarity);
              return (
                <PixelButton
                  key={rarity}
                  type="button"
                  pixelSize="compact"
                  className={cn(isActive && "pixel-button--active")}
                  onClick={() => toggleRarity(rarity)}
                >
                  {formatRarity(rarity)}
                </PixelButton>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="pixel-text-muted text-xs">{labels.dateLabel}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="pixel-text-muted text-xs">{labels.from}</span>
            <input
              type="date"
              value={dateRange.start}
              max={dateRange.end || undefined}
              onChange={(event) =>
                onDateRangeChange({
                  ...dateRange,
                  start: event.target.value,
                })
              }
              className="pixel-select-trigger w-full"
            />
          </label>
          <label className="space-y-1">
            <span className="pixel-text-muted text-xs">{labels.to}</span>
            <input
              type="date"
              value={dateRange.end}
              min={dateRange.start || undefined}
              onChange={(event) =>
                onDateRangeChange({
                  ...dateRange,
                  end: event.target.value,
                })
              }
              className="pixel-select-trigger w-full"
            />
          </label>
        </div>
        <p className="pixel-text-muted text-xs">{labels.hint}</p>
      </div>
    </PixelPanel>
  );
}
