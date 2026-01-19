import type { Meta, StoryObj } from "@storybook/react";
import { EmbedPreview } from "@/widgets/embed-view/ui/embed-preview";
import { sampleCharacterOverview } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof EmbedPreview> = {
  title: "widgets/EmbedPreview",
  component: EmbedPreview,
};

export default meta;

type Story = StoryObj<typeof EmbedPreview>;

export const Default: Story = {
  args: {
    userId: "user-123",
    theme: "light",
    size: "compact",
    language: "ko",
    generatedAt: "2026-01-19T10:00:00.000Z",
    overview: sampleCharacterOverview,
  },
};

export const Wide: Story = {
  args: {
    userId: "user-123",
    theme: "dark",
    size: "wide",
    language: "en",
    generatedAt: "2026-01-19T10:00:00.000Z",
    overview: sampleCharacterOverview,
  },
};
