import type { Meta, StoryObj } from "@storybook/react";
import { PixelSkeleton } from "@/shared/ui/pixel-skeleton";

const meta: Meta<typeof PixelSkeleton> = {
  title: "shared/PixelSkeleton",
  component: PixelSkeleton,
};

export default meta;

type Story = StoryObj<typeof PixelSkeleton>;

export const Default: Story = {};

export const Wide: Story = {
  args: {
    titleWidth: "w-40",
    lineWidths: ["w-52", "w-60", "w-48"],
  },
};
