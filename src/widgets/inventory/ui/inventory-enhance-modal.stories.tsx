import type { Meta, StoryObj } from "@storybook/react";
import { InventoryEnhanceModal } from "@/widgets/inventory/ui/inventory-enhance-modal";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { CATALOG_QUERY_KEY } from "@/entities/catalog/model/catalog-query";
import { createMockCatalogData } from "@/mocks/fixtures/catalog";

const meta: Meta<typeof InventoryEnhanceModal> = {
  title: "widgets/InventoryEnhanceModal",
  component: InventoryEnhanceModal,
  parameters: {
    layout: "centered",
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof InventoryEnhanceModal>;

const weaponItem = sampleInventoryItems[0];
const materialItem = sampleInventoryItems[4];

function WithCatalogPrefill({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData([...CATALOG_QUERY_KEY, "default"], () =>
      createMockCatalogData()
    );
  }, [queryClient]);

  return <>{children}</>;
}

export const Default: Story = {
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  args: {
    item: weaponItem,
    items: [weaponItem, materialItem],
    gold: 999,
    open: true,
    isPending: false,
    isSyncing: false,
    error: null,
    result: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const NotEnoughMaterial: Story = {
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  args: {
    item: weaponItem,
    items: [weaponItem, { ...materialItem, quantity: 0 }],
    gold: 999,
    open: true,
    isPending: false,
    isSyncing: false,
    error: null,
    result: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const NotEnoughGold: Story = {
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  args: {
    item: weaponItem,
    items: [weaponItem, materialItem],
    gold: 0,
    open: true,
    isPending: false,
    isSyncing: false,
    error: null,
    result: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const Syncing: Story = {
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  args: {
    item: weaponItem,
    items: [weaponItem, materialItem],
    gold: 999,
    open: true,
    isPending: false,
    isSyncing: true,
    error: null,
    result: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};

export const ErrorState: Story = {
  decorators: [(Story) => <WithCatalogPrefill>{Story()}</WithCatalogPrefill>],
  args: {
    item: weaponItem,
    items: [weaponItem, materialItem],
    gold: 999,
    open: true,
    isPending: false,
    isSyncing: false,
    error: new Error("강화에 실패했습니다."),
    result: null,
    onClose: () => undefined,
    onConfirm: async () => undefined,
  },
};
