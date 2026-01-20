import type { ReactNode, ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

interface PixelPanelProps extends ComponentProps<"section"> {
  title?: string;
  headerRight?: ReactNode;
  contentClassName?: string;
}

export function PixelPanel({
  title,
  headerRight,
  className,
  contentClassName,
  children,
  ...props
}: PixelPanelProps) {
  return (
    <section className={cn("pixel-panel", className)} {...props}>
      {title ? (
        <div className="pixel-panel-header">
          <h2 className="pixel-panel-title">{title}</h2>
          {headerRight ? <div>{headerRight}</div> : null}
        </div>
      ) : null}
      <div className={cn("pixel-panel-content", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
