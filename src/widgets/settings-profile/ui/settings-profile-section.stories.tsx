import type { Meta, StoryObj } from "@storybook/react";
import { SettingsProfileSection } from "@/widgets/settings-profile/ui/settings-profile-section";

const meta: Meta<typeof SettingsProfileSection> = {
  title: "widgets/SettingsProfileSection",
  component: SettingsProfileSection,
};

export default meta;

type Story = StoryObj<typeof SettingsProfileSection>;

export const Default: Story = {};
