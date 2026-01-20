import type { Meta, StoryObj } from "@storybook/react";
import { DashboardStatBar } from "@/widgets/dashboard-skin/ui/dashboard-stat-bar";

const meta: Meta<typeof DashboardStatBar> = {
  title: "widgets/DashboardStatBar",
  component: DashboardStatBar,
};

export default meta;

type Story = StoryObj<typeof DashboardStatBar>;

export const WithBar: Story = {
  args: {
    label: "HP",
    value: "40 / 60",
    percent: 66,
    tone: "hp",
  },
};

export const ValueInBar: Story = {
  args: {
    label: "EXP",
    value: "54 / 80",
    percent: 67,
    tone: "exp",
    valueInBar: true,
  },
};

export const TextOnly: Story = {
  args: {
    label: "AP",
    value: "18",
  },
};
