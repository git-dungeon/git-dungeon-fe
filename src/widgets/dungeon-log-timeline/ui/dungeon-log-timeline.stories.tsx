import type { Meta, StoryObj } from "@storybook/react";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";

const meta: Meta<typeof DungeonLogTimeline> = {
  title: "widgets/DungeonLogTimeline",
  component: DungeonLogTimeline,
};

export default meta;

type Story = StoryObj<typeof DungeonLogTimeline>;

export const Default: Story = {};
