import type { Meta, StoryObj } from "@storybook/react";
import { PixelCheckIcon } from "@/shared/ui/pixel-check-icon";

const meta: Meta<typeof PixelCheckIcon> = {
  title: "shared/PixelCheckIcon",
  component: PixelCheckIcon,
};

export default meta;

type Story = StoryObj<typeof PixelCheckIcon>;

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Hidden: Story = {
  args: {
    checked: false,
  },
};
