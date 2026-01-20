import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLogsPanel } from "@/widgets/dashboard-skin/ui/dashboard-logs-panel";
import { sampleDungeonLogs } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardLogsPanel> = {
  title: "widgets/DashboardLogsPanel",
  component: DashboardLogsPanel,
};

export default meta;

type Story = StoryObj<typeof DashboardLogsPanel>;

export const Default: Story = {
  args: {
    logs: sampleDungeonLogs.slice(0, 4),
  },
};

export const Empty: Story = {
  args: {
    logs: [],
  },
};
