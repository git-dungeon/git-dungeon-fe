import type { Meta, StoryObj } from "@storybook/react";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";

const meta: Meta<typeof PixelPanel> = {
  title: "shared/PixelPanel",
  component: PixelPanel,
};

export default meta;

type Story = StoryObj<typeof PixelPanel>;

export const Default: Story = {
  render: () => (
    <PixelPanel
      title="Dungeon Stats"
      headerRight={<PixelButton pixelSize="compact">설정</PixelButton>}
    >
      <div className="space-y-2 text-sm">
        <p>탐험 횟수: 12</p>
        <p>전리품: 5</p>
        <p>누적 골드: 3,420</p>
      </div>
    </PixelPanel>
  ),
};
