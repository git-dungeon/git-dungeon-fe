import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelect } from "@/features/settings/ui/language-select";

const meta: Meta<typeof LanguageSelect> = {
  title: "features/Settings/LanguageSelect",
  component: LanguageSelect,
};

export default meta;

type Story = StoryObj<typeof LanguageSelect>;

export const Default: Story = {
  args: {
    value: "ko",
    onChange: () => undefined,
    triggerId: "language-select",
    ariaLabel: "언어 선택",
  },
};
