import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsEmbeddingPreviewCard } from "@/widgets/settings-embedding/ui/settings-embedding-preview-card";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import { INVENTORY_QUERY_KEY } from "@/entities/inventory/model/inventory-query";
import { PROFILE_QUERY_KEY } from "@/entities/profile/model/profile-query";
import type { InventoryResponse } from "@/entities/inventory/model/types";
import {
  sampleDashboardState,
  sampleEquippedMap,
  sampleInventoryItems,
  sampleProfileOverview,
} from "@/mocks/fixtures/storybook";

const withSettingsData: Decorator = (Story) => (
  <SettingsDataProvider Story={Story} />
);

function SettingsDataProvider({ Story }: { Story: () => JSX.Element }) {
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60,
        },
      },
    });

    const inventoryResponse: InventoryResponse = {
      version: 1,
      items: sampleInventoryItems,
      equipped: sampleEquippedMap,
      summary: {
        base: sampleDashboardState.stats.base,
        total: sampleDashboardState.stats.total,
        equipmentBonus: sampleDashboardState.stats.equipmentBonus,
      },
    };

    client.setQueryData(DASHBOARD_STATE_QUERY_KEY, sampleDashboardState);
    client.setQueryData(INVENTORY_QUERY_KEY, inventoryResponse);
    client.setQueryData(PROFILE_QUERY_KEY, sampleProfileOverview);

    return client;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
}

const meta: Meta<typeof SettingsEmbeddingPreviewCard> = {
  title: "widgets/SettingsEmbeddingPreviewCard",
  component: SettingsEmbeddingPreviewCard,
  decorators: [withSettingsData],
};

export default meta;

type Story = StoryObj<typeof SettingsEmbeddingPreviewCard>;

export const Default: Story = {};
