import type { Meta, StoryObj } from "@storybook/react";
import { DashboardSummaryPanel } from "@/widgets/dashboard-skin/ui/dashboard-summary-panel";
import {
  sampleDashboardState,
  sampleInventoryItems,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardSummaryPanel> = {
  title: "widgets/DashboardSummaryPanel",
  component: DashboardSummaryPanel,
};

export default meta;

type Story = StoryObj<typeof DashboardSummaryPanel>;

export const Default: Story = {
  args: {
    level: sampleDashboardState.level,
    hp: sampleDashboardState.hp,
    maxHp: sampleDashboardState.maxHp,
    ap: sampleDashboardState.ap,
    exp: sampleDashboardState.exp,
    expToLevel: sampleDashboardState.expToLevel ?? 80,
    gold: sampleDashboardState.gold,
    equipment: sampleInventoryItems,
    avatarUrl: sampleDashboardState.equippedItems?.[0]?.sprite ?? null,
  },
};
