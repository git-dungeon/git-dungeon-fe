import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/shared/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "shared/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Danger",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};
