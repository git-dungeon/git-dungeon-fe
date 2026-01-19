import type { Meta, StoryObj } from "@storybook/react";
import { LoginScreen } from "@/widgets/login/ui/login-screen";

const meta: Meta<typeof LoginScreen> = {
  title: "widgets/LoginScreen",
  component: LoginScreen,
};

export default meta;

type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {
  args: {
    safeRedirect: "/",
  },
};

export const ErrorState: Story = {
  args: {
    safeRedirect: "/",
    authErrorCode: "AUTH_FORBIDDEN",
  },
};
