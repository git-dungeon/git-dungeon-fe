import { Card, CardContent, CardDescription } from "@/shared/ui/card";
import { formatNumber } from "@/entities/dashboard/lib/formatters";

export interface StatItemProps {
  title: string;
  caption: string;
  total: number;
  equipmentBonus?: number;
}

export function StatItem({
  title,
  caption,
  total,
  equipmentBonus = 0,
}: StatItemProps) {
  const formattedTotal = formatNumber(total);
  const hasBonus = equipmentBonus !== 0;
  const formattedBonus = hasBonus
    ? formatNumber(Math.abs(equipmentBonus))
    : null;

  return (
    <Card>
      <CardContent className="space-y-1.5">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {title}
        </p>

        <div className="text-foreground flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{formattedTotal}</span>
          {hasBonus && formattedBonus ? (
            <span className="text-sm font-medium text-red-400">
              ({equipmentBonus > 0 ? "+" : "-"}
              {formattedBonus})
            </span>
          ) : null}
        </div>

        <CardDescription className="text-xs">{caption}</CardDescription>
      </CardContent>
    </Card>
  );
}
