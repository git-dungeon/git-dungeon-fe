import type { Meta, StoryObj } from "@storybook/react";
import { PixelSlotButton } from "@/shared/ui/pixel-slot-button";
import { PixelIcon } from "@/shared/ui/pixel-icon";

const meta: Meta<typeof PixelSlotButton> = {
  title: "shared/PixelSlotButton",
  component: PixelSlotButton,
  args: {
    children: <PixelIcon name="item-count" />,
    "aria-label": "Slot button",
  },
};

export default meta;

type Story = StoryObj<typeof PixelSlotButton>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
