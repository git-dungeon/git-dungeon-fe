import type { Meta, StoryObj } from "@storybook/react";
import { SettingsProfileCard } from "@/widgets/settings-profile/ui/settings-profile-card";
import { sampleProfileOverview } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof SettingsProfileCard> = {
  title: "widgets/SettingsProfileCard",
  component: SettingsProfileCard,
};

export default meta;

type Story = StoryObj<typeof SettingsProfileCard>;

export const Default: Story = {
  args: {
    profile: sampleProfileOverview.profile,
    connections: sampleProfileOverview.connections,
  },
};
