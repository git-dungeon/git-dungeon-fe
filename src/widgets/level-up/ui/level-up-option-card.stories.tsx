import type { Meta, StoryObj } from "@storybook/react";
import type { LevelUpOption } from "@/entities/level-up/model/types";
import { LevelUpOptionCard } from "@/widgets/level-up/ui/level-up-option-card";

const meta: Meta<typeof LevelUpOptionCard> = {
  title: "widgets/LevelUpOptionCard",
  component: LevelUpOptionCard,
  args: {
    onSelect: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof LevelUpOptionCard>;

const baseOption: LevelUpOption = {
  stat: "atk",
  rarity: "rare",
  value: 3,
};

export const Default: Story = {
  args: {
    option: baseOption,
  },
};

export const HpCommon: Story = {
  args: {
    option: {
      stat: "hp",
      rarity: "common",
      value: 1,
    },
  },
};

export const LegendaryLuck: Story = {
  args: {
    option: {
      stat: "luck",
      rarity: "legendary",
      value: 5,
    },
  },
};

export const Pending: Story = {
  args: {
    option: baseOption,
    isPending: true,
  },
};
