import type { Meta, StoryObj } from "@storybook/react";
import { PixelProgress } from "@/shared/ui/pixel-progress";

const meta: Meta<typeof PixelProgress> = {
  title: "shared/PixelProgress",
  component: PixelProgress,
  args: {
    percent: 45,
    tone: "hp",
  },
};

export default meta;

type Story = StoryObj<typeof PixelProgress>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="pixel-app space-y-3 p-4">
      <PixelProgress percent={72} tone="hp" ariaLabel="HP" />
      <PixelProgress percent={44} tone="exp" ariaLabel="EXP" />
      <PixelProgress percent={18} tone="progress" ariaLabel="Progress" />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    percent: 60,
    tone: "exp",
    size: "value",
    valueLabel: "60%",
    ariaLabel: "EXP",
  },
  render: (args) => (
    <div className="pixel-app p-4">
      <PixelProgress {...args} />
    </div>
  ),
};
