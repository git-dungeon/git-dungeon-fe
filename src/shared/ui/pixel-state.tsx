import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelSkeleton } from "@/shared/ui/pixel-skeleton";

interface PixelStatePanelProps {
  className?: string;
  children: ReactNode;
}

function PixelStatePanel({ className, children }: PixelStatePanelProps) {
  return (
    <PixelPanel className={cn("p-4", className)} contentClassName="space-y-3">
      {children}
    </PixelPanel>
  );
}

interface PixelEmptyStateProps {
  message: ReactNode;
  className?: string;
}

export function PixelEmptyState({ message, className }: PixelEmptyStateProps) {
  return (
    <PixelStatePanel className={className}>
      <div className="pixel-text-muted text-sm">{message}</div>
    </PixelStatePanel>
  );
}

interface PixelErrorStateProps {
  message: ReactNode;
  className?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function PixelErrorState({
  message,
  className,
  children,
  actions,
}: PixelErrorStateProps) {
  return (
    <PixelStatePanel className={className}>
      <div className="flex flex-col gap-3 text-sm">
        <p className="pixel-text-danger">{message}</p>
        {children}
        {actions ? <div>{actions}</div> : null}
      </div>
    </PixelStatePanel>
  );
}

interface PixelSkeletonStateProps {
  className?: string;
  count?: number;
  titleWidth?: string;
  lineWidths?: string[];
}

export function PixelSkeletonState({
  className,
  count = 3,
  titleWidth,
  lineWidths,
}: PixelSkeletonStateProps) {
  return (
    <PixelStatePanel className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <PixelSkeleton
          key={`pixel-skeleton-${index}`}
          titleWidth={titleWidth}
          lineWidths={lineWidths}
        />
      ))}
    </PixelStatePanel>
  );
}
