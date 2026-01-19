import type { Meta, StoryObj } from "@storybook/react";
import { DungeonLogDetailDialog } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-detail-dialog";
import { sampleDungeonLogs } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DungeonLogDetailDialog> = {
  title: "widgets/DungeonLogDetailDialog",
  component: DungeonLogDetailDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof DungeonLogDetailDialog>;

export const Default: Story = {
  args: {
    log: sampleDungeonLogs[0],
    open: true,
    onOpenChange: () => undefined,
  },
};
