import type { Meta, StoryObj } from "@storybook/react";
import { SettingsEmbeddingPreviewCard } from "@/widgets/settings-embedding/ui/settings-embedding-preview-card";

const meta: Meta<typeof SettingsEmbeddingPreviewCard> = {
  title: "widgets/SettingsEmbeddingPreviewCard",
  component: SettingsEmbeddingPreviewCard,
};

export default meta;

type Story = StoryObj<typeof SettingsEmbeddingPreviewCard>;

export const Default: Story = {};
