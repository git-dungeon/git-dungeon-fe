import type { Meta, StoryObj } from "@storybook/react";
import { GitHubConnection } from "@/features/settings/ui/github-connection";
import { sampleProfileOverview } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof GitHubConnection> = {
  title: "features/Settings/GitHubConnection",
  component: GitHubConnection,
};

export default meta;

type Story = StoryObj<typeof GitHubConnection>;

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
