import type { Meta, StoryObj } from "@storybook/react";
import { LoginHero } from "@/widgets/login/ui/login-hero";
import loginSubImage from "@/assets/login/login-sub.webp";

const meta: Meta<typeof LoginHero> = {
  title: "widgets/LoginHero",
  component: LoginHero,
};

export default meta;

type Story = StoryObj<typeof LoginHero>;

export const Default: Story = {
  args: {
    imageSrc: loginSubImage,
    imageAlt: "로그인 히어로 이미지",
    title: "GIT DUNGEON",
  },
};
