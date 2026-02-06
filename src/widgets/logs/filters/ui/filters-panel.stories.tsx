import type { Meta, StoryObj } from "@storybook/react";
import {
  LogsFiltersPanel,
  type LogsFilterSelection,
} from "@/widgets/logs/filters/ui/filters-panel";

const meta: Meta<typeof LogsFiltersPanel> = {
  title: "widgets/logs/FiltersPanel",
  component: LogsFiltersPanel,
};

export default meta;

type Story = StoryObj<typeof LogsFiltersPanel>;

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
