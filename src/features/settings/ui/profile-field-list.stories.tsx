import type { Meta, StoryObj } from "@storybook/react";
import { ProfileFieldList } from "@/features/settings/ui/profile-field-list";

const meta: Meta<typeof ProfileFieldList> = {
  title: "features/Settings/ProfileFieldList",
  component: ProfileFieldList,
};

export default meta;

type Story = StoryObj<typeof ProfileFieldList>;

export const Default: Story = {
  args: {
    fields: [
      { id: "email", label: "Email", value: "mock@example.com" },
      { id: "userId", label: "User ID", value: "user-123" },
      {
        id: "joinedAt",
        label: "Joined",
        value: "2023-11-02",
        hint: "2 months ago",
        title: "2023-11-02 12:00",
      },
    ],
  },
};
