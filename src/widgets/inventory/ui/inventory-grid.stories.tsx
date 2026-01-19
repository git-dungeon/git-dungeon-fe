import type { Meta, StoryObj } from "@storybook/react";
import { InventoryGrid } from "@/widgets/inventory/ui/inventory-grid";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventoryGrid> = {
  title: "widgets/InventoryGrid",
  component: InventoryGrid,
};

export default meta;

type Story = StoryObj<typeof InventoryGrid>;

export const Default: Story = {
  args: {
    items: sampleInventoryItems,
    selectedItemId: sampleInventoryItems[0]?.id,
    onSelect: () => undefined,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    onSelect: () => undefined,
  },
};
