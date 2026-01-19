import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLogItem } from "@/widgets/dashboard-logs/ui/dashboard-log-item";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { sampleDungeonLogs } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardLogItem> = {
  title: "widgets/DashboardLogItem",
  component: DashboardLogItem,
};

export default meta;

type Story = StoryObj<typeof DashboardLogItem>;

export const Default: Story = {
  args: {
    log: sampleDungeonLogs[0],
    renderDelta: (entry) => <DeltaList entry={entry} />,
  },
};
