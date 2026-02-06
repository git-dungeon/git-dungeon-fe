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
import type {
  InventoryDateRange,
  InventoryEquippedFilter,
  InventorySortFilter,
} from "@/widgets/inventory/model/types";

const SLOT_OPTIONS: InventoryItemSlot[] = [
  "helmet",
  "armor",
  "weapon",
  "ring",
  "consumable",
  "material",
];

const RARITY_OPTIONS: EquipmentRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

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
  const { t } = useTranslation();

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
      title={t("inventory.filters.title")}
      contentClassName="space-y-4"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">
            {t("inventory.filters.labels.equipped")}
          </p>
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
                {t("inventory.filters.options.all")}
              </SelectItem>
              <SelectItem value="EQUIPPED" className="pixel-select-item">
                {t("inventory.filters.options.equipped")}
              </SelectItem>
              <SelectItem value="UNEQUIPPED" className="pixel-select-item">
                {t("inventory.filters.options.unequipped")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">
            {t("inventory.filters.labels.sort")}
          </p>
          <Select
            value={sortFilter}
            onValueChange={(next) => onSortChange(next as InventorySortFilter)}
          >
            <SelectTrigger className="pixel-select-trigger w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pixel-select-content">
              <SelectItem value="DEFAULT" className="pixel-select-item">
                {t("inventory.filters.options.sortDefault")}
              </SelectItem>
              <SelectItem value="ACQUIRED_DESC" className="pixel-select-item">
                {t("inventory.filters.options.sortNewest")}
              </SelectItem>
              <SelectItem value="ACQUIRED_ASC" className="pixel-select-item">
                {t("inventory.filters.options.sortOldest")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="pixel-text-muted text-xs">
            {t("inventory.filters.labels.slots")}
          </p>
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
          <p className="pixel-text-muted text-xs">
            {t("inventory.filters.labels.rarity")}
          </p>
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
        <p className="pixel-text-muted text-xs">
          {t("inventory.filters.labels.acquired")}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="pixel-text-muted text-xs">
              {t("inventory.filters.date.from")}
            </span>
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
            <span className="pixel-text-muted text-xs">
              {t("inventory.filters.date.to")}
            </span>
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
        <p className="pixel-text-muted text-xs">
          {t("inventory.filters.date.hint")}
        </p>
      </div>
    </PixelPanel>
  );
}
