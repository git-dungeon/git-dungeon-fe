import type { Meta, StoryObj } from "@storybook/react";
import { GithubConnection } from "@/features/settings/ui/github-connection";
import { sampleProfileOverview } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof GithubConnection> = {
  title: "features/Settings/GithubConnection",
  component: GithubConnection,
};

export default meta;

type Story = StoryObj<typeof GithubConnection>;

export const Connected: Story = {
  args: {
    connections: sampleProfileOverview.connections,
  },
};

export const Disconnected: Story = {
  args: {
    connections: {
      github: {
        connected: false,
      },
    },
  },
};
