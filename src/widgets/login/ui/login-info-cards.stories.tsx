import type { Meta, StoryObj } from "@storybook/react";
import { LoginInfoCards } from "@/widgets/login/ui/login-info-cards";
import cardGitHubImage from "@/assets/login/git-integration.webp";
import cardAutoImage from "@/assets/login/auto-exploration.webp";
import cardLootImage from "@/assets/login/epic-loot.webp";

const meta: Meta<typeof LoginInfoCards> = {
  title: "widgets/LoginInfoCards",
  component: LoginInfoCards,
};

export default meta;

type Story = StoryObj<typeof LoginInfoCards>;

export const Default: Story = {
  args: {
    cards: [
      {
        image: cardGitHubImage,
        title: "GitHub 연동",
        description: "커밋을 던전 탐험으로 변환합니다.",
      },
      {
        image: cardAutoImage,
        title: "자동 탐험",
        description: "가만히 있어도 진행되는 모험.",
      },
      {
        image: cardLootImage,
        title: "전리품 획득",
        description: "깊은 던전에서 희귀 아이템을 얻습니다.",
      },
    ],
  },
};
