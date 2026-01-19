import type { Meta, StoryObj } from "@storybook/react";
import { DashboardAttributesPanel } from "@/widgets/dashboard-skin/ui/dashboard-attributes-panel";
import {
  sampleCharacterStats,
  sampleDashboardState,
} from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardAttributesPanel> = {
  title: "widgets/DashboardAttributesPanel",
  component: DashboardAttributesPanel,
};

export default meta;

type Story = StoryObj<typeof DashboardAttributesPanel>;

export const Default: Story = {
  args: {
    stats: sampleCharacterStats,
    ap: sampleDashboardState.ap,
  },
};
