import { cn } from "@/shared/lib/utils";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
        variant === "default" &&
          "bg-primary/10 text-primary border-transparent",
        variant === "outline" && "border-border bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
