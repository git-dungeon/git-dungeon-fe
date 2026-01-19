import type { Meta, StoryObj } from "@storybook/react";
import { DashboardActivity } from "@/widgets/dashboard-activity/ui/dashboard-activity";
import {
  sampleDashboardState,
  sampleDungeonLogs,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardActivity> = {
  title: "widgets/DashboardActivity",
  component: DashboardActivity,
};

export default meta;

type Story = StoryObj<typeof DashboardActivity>;

export const Default: Story = {
  args: {
    latestLog: sampleDungeonLogs[0],
    apRemaining: sampleDashboardState.ap,
    currentAction: sampleDashboardState.currentAction,
    currentActionStartedAt:
      sampleDashboardState.currentActionStartedAt ?? undefined,
    lastActionCompletedAt: sampleDashboardState.lastActionCompletedAt,
    nextActionStartAt: sampleDashboardState.nextActionStartAt,
  },
};
