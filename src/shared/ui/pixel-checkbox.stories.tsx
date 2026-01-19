import type { Meta, StoryObj } from "@storybook/react";
import { PixelCheckbox } from "@/shared/ui/pixel-checkbox";

const meta: Meta<typeof PixelCheckbox> = {
  title: "shared/PixelCheckbox",
  component: PixelCheckbox,
};

export default meta;

type Story = StoryObj<typeof PixelCheckbox>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};
