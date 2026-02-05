import type { Meta, StoryObj } from "@storybook/react";
import { GitHubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { PixelIcon } from "@/shared/ui/pixel-icon";

const meta: Meta<typeof GitHubLoginButton> = {
  title: "features/Auth/GitHubLoginButton",
  component: GitHubLoginButton,
};

export default meta;

type Story = StoryObj<typeof GitHubLoginButton>;

export const Default: Story = {
  args: {
    redirectTo: "/",
    children: (
      <span className="inline-flex items-center gap-2">
        <PixelIcon name="github" size={14} />
        GitHub 로그인
      </span>
    ),
  },
};
