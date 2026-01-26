import type { Meta, StoryObj } from "@storybook/react";
import type { LevelUpOption } from "@/entities/level-up/model/types";
import { LevelUpOptionGrid } from "@/widgets/level-up/ui/level-up-option-grid";

const meta: Meta<typeof LevelUpOptionGrid> = {
  title: "widgets/LevelUpOptionGrid",
  component: LevelUpOptionGrid,
  args: {
    onSelect: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof LevelUpOptionGrid>;

const options: LevelUpOption[] = [
  { stat: "atk", rarity: "rare", value: 3 },
  { stat: "hp", rarity: "common", value: 1 },
  { stat: "def", rarity: "uncommon", value: 2 },
];

export const Default: Story = {
  args: {
    options,
  },
};

export const Pending: Story = {
  args: {
    options,
    isPending: true,
  },
};
