import type { Meta, StoryObj } from "@storybook/react";
import { PixelAvatar } from "@/shared/ui/pixel-avatar";

const meta: Meta<typeof PixelAvatar> = {
  title: "shared/PixelAvatar",
  component: PixelAvatar,
  args: {
    src: "/vite.svg",
    alt: "Avatar",
    className: "size-16 p-0",
    imageClassName: "h-full w-full object-contain",
  },
  render: (args) => (
    <div className="pixel-app p-4">
      <PixelAvatar {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof PixelAvatar>;

export const Default: Story = {};

export const FallbackInitials: Story = {
  args: { src: null },
  render: (args) => (
    <div className="pixel-app p-4">
      <PixelAvatar
        {...args}
        fallback={<span className="text-base font-semibold">GD</span>}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="pixel-app flex flex-wrap items-center gap-6 p-6">
      <PixelAvatar
        src="/vite.svg"
        alt="Small avatar"
        className="size-10 p-0"
        imageClassName="h-full w-full object-contain"
      />
      <PixelAvatar
        src="/vite.svg"
        alt="Medium avatar"
        className="size-14 p-0"
        imageClassName="h-full w-full object-contain"
      />
      <PixelAvatar
        src="/vite.svg"
        alt="Large avatar"
        className="size-20 p-0"
        imageClassName="h-full w-full object-contain"
      />
      <PixelAvatar
        src={null}
        alt="Fallback avatar"
        className="size-16 p-0"
        fallback={<span className="text-base font-semibold">GD</span>}
      />
    </div>
  ),
};
