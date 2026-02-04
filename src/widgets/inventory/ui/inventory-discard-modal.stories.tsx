import type { Meta, StoryObj } from "@storybook/react";
import { InventoryDiscardModal } from "@/widgets/inventory/ui/inventory-discard-modal";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof InventoryDiscardModal> = {
  title: "widgets/InventoryDiscardModal",
  component: InventoryDiscardModal,
  parameters: {
    layout: "centered",
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof InventoryDiscardModal>;

const baseItem = sampleInventoryItems[4];

export const Default: Story = {
  args: {
    item: baseItem,
    open: true,
    isPending: false,
    isSyncing: false,
    error: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const Syncing: Story = {
  args: {
    item: baseItem,
    open: true,
    isPending: false,
    isSyncing: true,
    error: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const ErrorState: Story = {
  args: {
    item: baseItem,
    open: true,
    isPending: false,
    isSyncing: false,
    error: new Error("아이템 버리기에 실패했습니다."),
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};
