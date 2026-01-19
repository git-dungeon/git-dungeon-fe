import type { Meta, StoryObj } from "@storybook/react";
import { DashboardStatRow } from "@/widgets/dashboard-skin/ui/dashboard-stat-row";

const meta: Meta<typeof DashboardStatRow> = {
  title: "widgets/DashboardStatRow",
  component: DashboardStatRow,
};

export default meta;

type Story = StoryObj<typeof DashboardStatRow>;

export const Spread: Story = {
  args: {
    label: "HP",
    value: "40 / 60",
  },
};

export const Inline: Story = {
  args: {
    label: "Floor",
    value: "13 / 15",
    layout: "inline",
  },
};
