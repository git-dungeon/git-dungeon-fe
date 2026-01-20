import type { Meta, StoryObj } from "@storybook/react";
import { InventoryCharacterPanel } from "@/widgets/inventory/ui/inventory-character-panel";
import { sampleCharacterStats } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventoryCharacterPanel> = {
  title: "widgets/InventoryCharacterPanel",
  component: InventoryCharacterPanel,
};

export default meta;

type Story = StoryObj<typeof InventoryCharacterPanel>;

export const Default: Story = {
  args: {
    stats: sampleCharacterStats,
    level: 8,
  },
};
