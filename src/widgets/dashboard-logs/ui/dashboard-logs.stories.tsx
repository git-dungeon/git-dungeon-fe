import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLogs } from "@/widgets/dashboard-logs/ui/dashboard-logs";
import { sampleDungeonLogs } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardLogs> = {
  title: "widgets/DashboardLogs",
  component: DashboardLogs,
};

export default meta;

type Story = StoryObj<typeof DashboardLogs>;

export const Default: Story = {
  args: {
    logs: sampleDungeonLogs.slice(0, 3),
  },
};
