import type { Meta, StoryObj } from "@storybook/react";
import { PreferencesForm } from "@/features/settings/ui/preferences-form";

const meta: Meta<typeof PreferencesForm> = {
  title: "features/Settings/PreferencesForm",
  component: PreferencesForm,
};

export default meta;

type Story = StoryObj<typeof PreferencesForm>;

export const Default: Story = {
  args: {
    theme: "system",
    language: "ko",
    onThemeChange: () => undefined,
    onLanguageChange: () => undefined,
  },
};
