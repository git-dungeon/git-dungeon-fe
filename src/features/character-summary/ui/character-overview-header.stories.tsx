import type { Meta, StoryObj } from "@storybook/react";
import { CharacterOverviewHeader } from "@/features/character-summary/ui/character-overview-header";
import { sampleDashboardState } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof CharacterOverviewHeader> = {
  title: "features/CharacterSummary/CharacterOverviewHeader",
  component: CharacterOverviewHeader,
};

export default meta;

type Story = StoryObj<typeof CharacterOverviewHeader>;

export const Default: Story = {
  args: {
    level: sampleDashboardState.level,
    exp: sampleDashboardState.exp,
    expToLevel: sampleDashboardState.expToLevel ?? 80,
    floor: {
      current: sampleDashboardState.floor,
      best: sampleDashboardState.maxFloor,
      progress: sampleDashboardState.floorProgress,
    },
    gold: sampleDashboardState.gold,
    ap: sampleDashboardState.ap,
  },
};
