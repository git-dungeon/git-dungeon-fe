import type { Meta, StoryObj } from "@storybook/react";
import { SummaryTile } from "@/shared/ui/summary-tile";
import { PixelPill } from "@/shared/ui/pixel-pill";

const meta: Meta<typeof SummaryTile> = {
  title: "shared/SummaryTile",
  component: SummaryTile,
};

export default meta;

type Story = StoryObj<typeof SummaryTile>;

export const Default: Story = {
  render: () => (
    <SummaryTile title="Daily EXP" value="2,340">
      <PixelPill tone="gain" icon="up">
        +12%
      </PixelPill>
    </SummaryTile>
  ),
};
