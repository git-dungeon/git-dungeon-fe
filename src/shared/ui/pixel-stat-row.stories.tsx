import type { Meta, StoryObj } from "@storybook/react";
import { PixelStatRow } from "@/shared/ui/pixel-stat-row";

const meta: Meta<typeof PixelStatRow> = {
  title: "shared/PixelStatRow",
  component: PixelStatRow,
  render: (args) => (
    <div className="pixel-app p-4">
      <PixelStatRow {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof PixelStatRow>;

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
