import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

type TabsProps = TabsPrimitive.TabsProps;

type TabsListProps = TabsPrimitive.TabsListProps;

type TabsTriggerProps = TabsPrimitive.TabsTriggerProps;

type TabsContentProps = TabsPrimitive.TabsContentProps;

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-lg p-1",
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex min-w-[100px] items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow",
        className
      )}
      {...props}
    />
  )
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
);

TabsContent.displayName = TabsPrimitive.Content.displayName;

export type { TabsProps };
