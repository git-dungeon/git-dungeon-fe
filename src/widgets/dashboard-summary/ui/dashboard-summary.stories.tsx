import type { Meta, StoryObj } from "@storybook/react";
import { DashboardSummary } from "@/widgets/dashboard-summary/ui/dashboard-summary";
import { sampleDashboardState } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardSummary> = {
  title: "widgets/DashboardSummary",
  component: DashboardSummary,
};

export default meta;

type Story = StoryObj<typeof DashboardSummary>;

export const Default: Story = {
  args: {
    state: sampleDashboardState,
  },
};
