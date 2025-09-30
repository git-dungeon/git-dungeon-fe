import { cn } from "@/shared/lib/utils";

interface SummaryTileProps {
  title: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export function SummaryTile({
  title,
  value,
  children,
  className,
}: SummaryTileProps) {
  return (
    <div
      className={cn(
        "border-border bg-card flex flex-col gap-1 rounded-lg border p-4 shadow-sm",
        className
      )}
    >
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      <p className="text-foreground text-xl font-semibold">{value}</p>
      {children}
    </div>
  );
}
