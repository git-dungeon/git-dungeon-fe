import type { Meta, StoryObj } from "@storybook/react";
import { EmbedPreviewSkeleton } from "@/widgets/embed-view/ui/embed-preview-skeleton";

const meta: Meta<typeof EmbedPreviewSkeleton> = {
  title: "widgets/EmbedPreviewSkeleton",
  component: EmbedPreviewSkeleton,
};

export default meta;

type Story = StoryObj<typeof EmbedPreviewSkeleton>;

export const Compact: Story = {
  args: {
    size: "compact",
    language: "ko",
  },
};

export const Wide: Story = {
  args: {
    size: "wide",
    language: "en",
  },
};
