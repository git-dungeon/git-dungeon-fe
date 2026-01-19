import type { Meta, StoryObj } from "@storybook/react";
import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import {
  sampleCharacterStats,
  sampleDashboardState,
  sampleInventoryItems,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardEmbeddingBanner> = {
  title: "widgets/DashboardEmbeddingBanner",
  component: DashboardEmbeddingBanner,
};

export default meta;

type Story = StoryObj<typeof DashboardEmbeddingBanner>;

export const Default: Story = {
  args: {
    level: sampleDashboardState.level,
    exp: sampleDashboardState.exp,
    expToLevel: sampleDashboardState.expToLevel ?? 80,
    gold: sampleDashboardState.gold,
    ap: sampleDashboardState.ap,
    floor: {
      current: sampleDashboardState.floor,
      best: sampleDashboardState.maxFloor,
      progress: sampleDashboardState.floorProgress,
    },
    stats: sampleCharacterStats,
    equipment: sampleInventoryItems,
    layoutMode: "responsive",
  },
};
