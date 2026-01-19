import type { Meta, StoryObj } from "@storybook/react";
import { PixelPill } from "@/shared/ui/pixel-pill";

const meta: Meta<typeof PixelPill> = {
  title: "shared/PixelPill",
  component: PixelPill,
  args: {
    children: "+12",
  },
};

export default meta;

type Story = StoryObj<typeof PixelPill>;

export const Neutral: Story = {
  args: {
    tone: "neutral",
    children: "Neutral",
  },
};

export const Gain: Story = {
  args: {
    tone: "gain",
    icon: "up",
    children: "+12",
  },
};

export const Loss: Story = {
  args: {
    tone: "loss",
    icon: "down",
    children: "-3",
  },
};

export const Rarity: Story = {
  args: {
    tone: "rarity",
    rarity: "legendary",
    children: "Legendary",
  },
};
