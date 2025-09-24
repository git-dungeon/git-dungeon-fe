import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { cn } from "@/shared/lib/utils";
import { ChartContainer, type ChartConfig } from "@/shared/ui/chart";

interface RadialProgressProps {
  percent: number;
  label: string;
  secondaryLabel?: string;
  size?: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

const DEFAULT_SIZE = 128;
const DEFAULT_FILL = "var(--color-chart-1)";
const DEFAULT_TRACK = "var(--color-muted)";

export function RadialProgress({
  percent,
  label,
  secondaryLabel,
  size = DEFAULT_SIZE,
  color = DEFAULT_FILL,
  trackColor = DEFAULT_TRACK,
  className,
}: RadialProgressProps) {
  const clampedPercent = Number.isFinite(percent)
    ? Math.min(Math.max(percent, 0), 100)
    : 0;

  const chartData = [
    {
      name: "progress",
      value: clampedPercent,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            dataKey="value"
            tick={false}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={999}
            fill={color}
            background={{ fill: trackColor }}
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-foreground text-sm font-semibold">{label}</span>
        {secondaryLabel ? (
          <span className="text-muted-foreground text-xs">
            {secondaryLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
