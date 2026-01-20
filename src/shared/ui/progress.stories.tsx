import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@/shared/ui/progress";

const meta: Meta<typeof Progress> = {
  title: "shared/Progress",
  component: Progress,
  args: {
    value: 45,
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const High: Story = {
  args: {
    value: 85,
  },
};
