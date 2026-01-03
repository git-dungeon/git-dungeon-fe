import { cn } from "@/shared/lib/utils";

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
        <div className="pixel-bar pixel-bar--value flex-1">
          <div
            className={cn("pixel-bar__fill", `pixel-bar__fill--${tone}`)}
            style={{ width: `${percent}%` }}
          />
          <span className="pixel-bar__value">{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <span className="pixel-stat-label">{label}</span>
        <span className="pixel-stat-value">{value}</span>
      </div>
      <div className="pixel-bar">
        <div
          className={cn("pixel-bar__fill", `pixel-bar__fill--${tone}`)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
