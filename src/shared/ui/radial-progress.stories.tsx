import type { Meta, StoryObj } from "@storybook/react";
import { RadialProgress } from "@/shared/ui/radial-progress";

const meta: Meta<typeof RadialProgress> = {
  title: "shared/RadialProgress",
  component: RadialProgress,
  args: {
    percent: 72,
    label: "72%",
    secondaryLabel: "EXP",
  },
};

export default meta;

type Story = StoryObj<typeof RadialProgress>;

export const Default: Story = {};

export const Low: Story = {
  args: {
    percent: 18,
    label: "18%",
  },
};
