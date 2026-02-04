import type { Meta, StoryObj } from "@storybook/react";
import { PixelSlider } from "@/shared/ui/pixel-slider";

const meta: Meta<typeof PixelSlider> = {
  title: "shared/PixelSlider",
  component: PixelSlider,
};

export default meta;

type Story = StoryObj<typeof PixelSlider>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [45],
  },
};

export const Range: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [25, 75],
  },
};

export const Disabled: Story = {
  args: {
    min: 0,
    max: 10,
    step: 1,
    defaultValue: [4],
    disabled: true,
  },
};
