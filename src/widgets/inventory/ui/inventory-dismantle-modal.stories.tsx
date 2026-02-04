import type { Meta, StoryObj } from "@storybook/react";
import { InventoryDismantleModal } from "@/widgets/inventory/ui/inventory-dismantle-modal";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";
import { WithCatalogPrefill } from "@/mocks/decorators/with-catalog-prefill";

const meta: Meta<typeof InventoryDismantleModal> = {
  title: "widgets/InventoryDismantleModal",
  component: InventoryDismantleModal,
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  parameters: {
    layout: "centered",
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof InventoryDismantleModal>;

const baseItem = sampleInventoryItems[0];

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
    error: new Error("아이템 분해에 실패했습니다."),
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};
