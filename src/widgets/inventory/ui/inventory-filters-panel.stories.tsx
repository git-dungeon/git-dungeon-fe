import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
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

type InventoryFiltersPanelArgs = ComponentProps<typeof InventoryFiltersPanel>;

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

export const Default: Story = {
  render: () => {
    // Storybook preview hook: must be called inside story render/decorator.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [args, updateArgs] = useArgs<InventoryFiltersPanelArgs>();

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
  },
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
  render: () => {
    // Storybook preview hook: must be called inside story render/decorator.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [args, updateArgs] = useArgs<InventoryFiltersPanelArgs>();

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
  },
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
