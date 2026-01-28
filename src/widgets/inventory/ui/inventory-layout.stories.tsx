import type { Meta, StoryObj } from "@storybook/react";
import { InventoryLayout } from "@/widgets/inventory/ui/inventory-layout";
import {
  sampleCharacterStats,
  sampleEquippedMap,
  sampleInventoryItems,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventoryLayout> = {
  title: "widgets/InventoryLayout",
  component: InventoryLayout,
};

export default meta;

type Story = StoryObj<typeof InventoryLayout>;

export const Default: Story = {
  args: {
    items: sampleInventoryItems,
    equipped: sampleEquippedMap,
    stats: sampleCharacterStats,
    level: 8,
    avatarUrl: null,
    isPending: false,
    isSyncing: false,
    error: null,
    onEquip: async () => undefined,
    onUnequip: async () => undefined,
    onDiscard: async () => undefined,
    onDismantle: async () => undefined,
    dismantleError: null,
    onClearError: () => undefined,
  },
};
