import type { Meta, StoryObj } from "@storybook/react";
import { ProfileIdentity } from "@/features/settings/ui/profile-identity";
import { sampleProfileOverview } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof ProfileIdentity> = {
  title: "features/Settings/ProfileIdentity",
  component: ProfileIdentity,
};

export default meta;

type Story = StoryObj<typeof ProfileIdentity>;

export const Default: Story = {
  args: {
    profile: sampleProfileOverview.profile,
  },
};
