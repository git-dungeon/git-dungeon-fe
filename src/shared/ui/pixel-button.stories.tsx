import type { Meta, StoryObj } from "@storybook/react";
import { PixelButton } from "@/shared/ui/pixel-button";

const meta: Meta<typeof PixelButton> = {
  title: "shared/PixelButton",
  component: PixelButton,
  args: {
    children: "Action",
  },
};

export default meta;

type Story = StoryObj<typeof PixelButton>;

export const Default: Story = {};

export const Danger: Story = {
  args: {
    tone: "danger",
    children: "Delete",
  },
};

export const Compact: Story = {
  args: {
    pixelSize: "compact",
    children: "Compact",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};
