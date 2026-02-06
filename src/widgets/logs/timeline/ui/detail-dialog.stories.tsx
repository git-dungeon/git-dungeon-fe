import type { Meta, StoryObj } from "@storybook/react";
import { LogsDetailDialog } from "@/widgets/logs/timeline/ui/detail-dialog";
import { sampleLogs } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof LogsDetailDialog> = {
  title: "widgets/logs/DetailDialog",
  component: LogsDetailDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof LogsDetailDialog>;

export const Default: Story = {
  args: {
    log: sampleLogs[0],
    open: true,
    onOpenChange: () => undefined,
  },
};
