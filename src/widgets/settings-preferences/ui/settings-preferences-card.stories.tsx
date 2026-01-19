import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPreferencesCard } from "@/widgets/settings-preferences/ui/settings-preferences-card";

const meta: Meta<typeof SettingsPreferencesCard> = {
  title: "widgets/SettingsPreferencesCard",
  component: SettingsPreferencesCard,
};

export default meta;

type Story = StoryObj<typeof SettingsPreferencesCard>;

export const Default: Story = {};
