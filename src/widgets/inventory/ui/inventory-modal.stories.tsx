import type { Meta, StoryObj } from "@storybook/react";
import { InventoryModal } from "@/widgets/inventory/ui/inventory-modal";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventoryModal> = {
  title: "widgets/InventoryModal",
  component: InventoryModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof InventoryModal>;

const item = sampleInventoryItems[0];

export const Default: Story = {
  args: {
    item,
    slot: item.slot,
    isPending: false,
    isSyncing: false,
    error: null,
    dismantleError: null,
    onClose: () => undefined,
    onEquip: async () => undefined,
    onUnequip: async () => undefined,
    onDiscard: async () => undefined,
    onDismantle: async () => undefined,
    onClearError: () => undefined,
  },
};

export const Syncing: Story = {
  args: {
    item,
    slot: item.slot,
    isPending: false,
    isSyncing: true,
    error: null,
    dismantleError: null,
    onClose: () => undefined,
    onEquip: async () => undefined,
    onUnequip: async () => undefined,
    onDiscard: async () => undefined,
    onDismantle: async () => undefined,
    onClearError: () => undefined,
  },
};

export const ErrorState: Story = {
  args: {
    item,
    slot: item.slot,
    isPending: false,
    isSyncing: false,
    error: new Error("장비 장착에 실패했습니다."),
    dismantleError: null,
    onClose: () => undefined,
    onEquip: async () => undefined,
    onUnequip: async () => undefined,
    onDiscard: async () => undefined,
    onDismantle: async () => undefined,
    onClearError: () => undefined,
  },
};
