import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface StatValueWithBonusProps {
  bonus: number;
  children: ReactNode;
  format?: (value: number) => string;
}

function defaultFormat(value: number) {
  return `${value}`;
}

export function StatValueWithBonus({
  bonus,
  children,
  format = defaultFormat,
}: StatValueWithBonusProps) {
  if (!Number.isFinite(bonus) || bonus === 0) {
    return <>{children}</>;
  }

  const sign = bonus > 0 ? "+" : "";
  const toneClass =
    bonus > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  return (
    <>
      {children}
      <span className={cn("ml-1", toneClass)}>
        ({sign}
        {format(bonus)})
      </span>
    </>
  );
}
