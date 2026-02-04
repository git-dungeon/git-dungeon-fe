import type { Meta, StoryObj } from "@storybook/react";
import {
  InventoryFiltersPanel,
  type InventoryDateRange,
  type InventoryEquippedFilter,
  type InventorySortFilter,
} from "@/widgets/inventory/ui/inventory-filters-panel";
import type {
  EquipmentRarity,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof InventoryFiltersPanel> = {
  title: "widgets/InventoryFiltersPanel",
  component: InventoryFiltersPanel,
  parameters: {
    layout: "padded",
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof InventoryFiltersPanel>;

function InventoryFiltersPanelArgsBridge() {
  const [args, updateArgs] = useArgs<typeof meta>();

  return (
    <InventoryFiltersPanel
      {...args}
      onEquippedChange={(value) => updateArgs({ equippedFilter: value })}
      onSortChange={(value) => updateArgs({ sortFilter: value })}
      onSlotsChange={(value) => updateArgs({ selectedSlots: value })}
      onRaritiesChange={(value) => updateArgs({ selectedRarities: value })}
      onDateRangeChange={(value) => updateArgs({ dateRange: value })}
    />
  );
}

export const Default: Story = {
  render: () => <InventoryFiltersPanelArgsBridge />,
  args: {
    equippedFilter: "ALL" satisfies InventoryEquippedFilter,
    sortFilter: "DEFAULT" satisfies InventorySortFilter,
    selectedSlots: [] satisfies InventoryItemSlot[],
    selectedRarities: [] satisfies EquipmentRarity[],
    dateRange: {
      start: "",
      end: "",
    } satisfies InventoryDateRange,
    onEquippedChange: () => undefined,
    onSortChange: () => undefined,
    onSlotsChange: () => undefined,
    onRaritiesChange: () => undefined,
    onDateRangeChange: () => undefined,
  },
};

export const WithSelections: Story = {
  render: () => <InventoryFiltersPanelArgsBridge />,
  args: {
    equippedFilter: "EQUIPPED" satisfies InventoryEquippedFilter,
    sortFilter: "ACQUIRED_DESC" satisfies InventorySortFilter,
    selectedSlots: ["weapon", "armor"] satisfies InventoryItemSlot[],
    selectedRarities: ["rare", "epic"] satisfies EquipmentRarity[],
    dateRange: {
      start: "2026-01-01",
      end: "2026-02-04",
    } satisfies InventoryDateRange,
    onEquippedChange: () => undefined,
    onSortChange: () => undefined,
    onSlotsChange: () => undefined,
    onRaritiesChange: () => undefined,
    onDateRangeChange: () => undefined,
  },
};
