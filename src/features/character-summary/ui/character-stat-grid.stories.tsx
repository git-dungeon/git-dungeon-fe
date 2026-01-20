import type { Meta, StoryObj } from "@storybook/react";
import { CharacterStatGrid } from "@/features/character-summary/ui/character-stat-grid";
import { sampleCharacterStats } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof CharacterStatGrid> = {
  title: "features/CharacterSummary/CharacterStatGrid",
  component: CharacterStatGrid,
};

export default meta;

type Story = StoryObj<typeof CharacterStatGrid>;

export const Default: Story = {
  args: {
    stats: sampleCharacterStats,
  },
};
