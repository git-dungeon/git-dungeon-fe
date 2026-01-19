import type { Meta, StoryObj } from "@storybook/react";
import { PixelIcon } from "@/shared/ui/pixel-icon";

const meta: Meta<typeof PixelIcon> = {
  title: "shared/PixelIcon",
  component: PixelIcon,
};

export default meta;

type Story = StoryObj<typeof PixelIcon>;

const iconNames = [
  "copy",
  "close",
  "refresh",
  "arrow-up",
  "arrow-down",
  "check",
  "item-count",
  "plus",
  "minus",
  "github",
] as const;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      {iconNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <PixelIcon name={name} size={18} />
          <span className="text-muted-foreground text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};
