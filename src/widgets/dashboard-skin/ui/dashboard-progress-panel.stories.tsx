import type { Meta, StoryObj } from "@storybook/react";
import { DashboardProgressPanel } from "@/widgets/dashboard-skin/ui/dashboard-progress-panel";

const meta: Meta<typeof DashboardProgressPanel> = {
  title: "widgets/DashboardProgressPanel",
  component: DashboardProgressPanel,
};

export default meta;

type Story = StoryObj<typeof DashboardProgressPanel>;

export const Default: Story = {
  args: {
    floor: {
      current: 13,
      best: 15,
      progress: 60,
    },
  },
};
