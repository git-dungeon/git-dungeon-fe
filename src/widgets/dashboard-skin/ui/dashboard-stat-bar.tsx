import { cn } from "@/shared/lib/utils";
import { PixelProgress } from "@/shared/ui/pixel-progress";

interface DashboardStatBarProps {
  label: string;
  value: string;
  percent?: number;
  tone?: "hp" | "exp" | "progress";
  className?: string;
  valueInBar?: boolean;
}

export function DashboardStatBar({
  label,
  value,
  percent,
  tone = "hp",
  className,
  valueInBar = false,
}: DashboardStatBarProps) {
  if (typeof percent !== "number") {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <span className="pixel-stat-label">{label}</span>
        <span className="pixel-stat-value">{value}</span>
      </div>
    );
  }

  if (valueInBar) {
    return (
      <div className={cn("pixel-stat-bar", className)}>
        <span className="pixel-stat-label pixel-stat-label--bar">{label}</span>
        <PixelProgress
          className="flex-1"
          percent={percent}
          tone={tone}
          size="value"
          valueLabel={value}
          ariaLabel={label}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <span className="pixel-stat-label">{label}</span>
        <span className="pixel-stat-value">{value}</span>
      </div>
      <PixelProgress percent={percent} tone={tone} ariaLabel={label} />
    </div>
  );
}
