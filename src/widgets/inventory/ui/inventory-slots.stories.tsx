import type { Meta, StoryObj } from "@storybook/react";
import { InventorySlots } from "@/widgets/inventory/ui/inventory-slots";
import {
  sampleEquippedMap,
  sampleInventoryItems,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventorySlots> = {
  title: "widgets/InventorySlots",
  component: InventorySlots,
};

export default meta;

type Story = StoryObj<typeof InventorySlots>;

export const Default: Story = {
  args: {
    equipped: sampleEquippedMap,
    selectedItemId: sampleInventoryItems[0]?.id,
    onSelect: () => undefined,
  },
};
