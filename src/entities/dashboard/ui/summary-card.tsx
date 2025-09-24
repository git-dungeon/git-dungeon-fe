import { cn } from "@/shared/lib/utils";
import { RadialProgress } from "@/shared/ui/radial-progress";
import { Card, CardContent, CardDescription } from "@/shared/ui/card";

interface SummaryCardChart {
  current: number;
  max: number;
  color?: string;
  secondaryLabel?: string;
  valueLabel?: string;
}

interface SummaryCardProps {
  title: string;
  value: string;
  caption: string;
  chart?: SummaryCardChart;
}

export function SummaryCard({
  title,
  value,
  caption,
  chart,
}: SummaryCardProps) {
  const percent =
    chart && chart.max > 0 ? (chart.current / chart.max) * 100 : 0;
  const safePercent = Number.isFinite(percent) ? percent : 0;
  const clampedPercent = Math.min(Math.max(safePercent, 0), 100);
  const label = chart?.valueLabel ?? value;
  const secondaryLabel = chart?.secondaryLabel ?? `${Math.round(safePercent)}%`;

  return (
    <Card>
      <CardContent>
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {title}
        </p>
        {chart ? (
          <RadialProgress
            className="mx-auto mt-2"
            color={chart.color}
            label={label}
            percent={clampedPercent}
            secondaryLabel={secondaryLabel}
          />
        ) : (
          <p className="text-foreground mt-2 text-2xl font-semibold">{value}</p>
        )}
        <CardDescription className={cn("text-xs", chart ? "mt-4" : "mt-1")}>
          {caption}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
