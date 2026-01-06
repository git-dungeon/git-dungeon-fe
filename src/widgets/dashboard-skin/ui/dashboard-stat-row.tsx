import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface DashboardStatRowProps {
  label: string;
  value: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  layout?: "spread" | "inline";
  wrap?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function DashboardStatRow({
  label,
  value,
  iconSrc,
  iconAlt,
  layout = "spread",
  wrap = false,
  className,
  labelClassName,
  valueClassName,
}: DashboardStatRowProps) {
  const layoutClass =
    layout === "inline"
      ? "flex items-center gap-3"
      : "flex items-center justify-between gap-3";

  return (
    <div className={cn(layoutClass, wrap && "flex-wrap", className)}>
      <div className="flex items-center gap-2">
        {iconSrc ? (
          <img src={iconSrc} alt={iconAlt ?? label} className="h-4 w-4" />
        ) : null}
        <span className={cn("pixel-stat-label", labelClassName)}>{label}</span>
      </div>
      <span className={cn("pixel-stat-value", valueClassName)}>{value}</span>
    </div>
  );
}
