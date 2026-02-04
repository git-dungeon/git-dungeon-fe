import type { Meta, StoryObj } from "@storybook/react";
import { PixelInput } from "@/shared/ui/pixel-input";

const meta: Meta<typeof PixelInput> = {
  title: "shared/PixelInput",
  component: PixelInput,
  args: {
    placeholder: "Type here...",
  },
};

export default meta;

type Story = StoryObj<typeof PixelInput>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello pixel input",
  },
};
