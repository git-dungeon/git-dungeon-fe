import type { Meta, StoryObj } from "@storybook/react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const meta: Meta<typeof ChartContainer> = {
  title: "shared/Chart",
  component: ChartContainer,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

const chartData = [
  { name: "Mon", value: 420 },
  { name: "Tue", value: 860 },
  { name: "Wed", value: 640 },
  { name: "Thu", value: 980 },
  { name: "Fri", value: 760 },
  { name: "Sat", value: 540 },
  { name: "Sun", value: 1120 },
];

const chartConfig = {
  value: {
    label: "EXP",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export const LineChartSample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="w-[480px] max-w-full">
      <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};
