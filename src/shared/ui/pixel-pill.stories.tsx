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

export const Success: Story = {
  args: {
    tone: "success",
    icon: "up",
    children: "+12",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
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
