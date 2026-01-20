import type { Meta, StoryObj } from "@storybook/react";
import {
  DungeonLogFiltersPanel,
  type LogsFilterSelection,
} from "@/widgets/dungeon-log-filters/ui/dungeon-log-filters-panel";

const meta: Meta<typeof DungeonLogFiltersPanel> = {
  title: "widgets/DungeonLogFiltersPanel",
  component: DungeonLogFiltersPanel,
};

export default meta;

type Story = StoryObj<typeof DungeonLogFiltersPanel>;

export const Default: Story = {
  args: {
    value: "ALL" as LogsFilterSelection,
    onChange: () => undefined,
    dateRange: {
      start: "2026-01-01",
      end: "2026-01-19",
    },
    onDateRangeChange: () => undefined,
  },
};
