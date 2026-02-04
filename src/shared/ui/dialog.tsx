import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/shared/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function resolvePixelAppContainer() {
  if (typeof document === "undefined") {
    return null;
  }

  const element = document.querySelector(".pixel-app");
  return element instanceof HTMLElement ? element : null;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // .pixel-app 내부로 Portal 렌더링하여 CSS 변수 상속
  // Storybook 등의 초기 렌더 타이밍에서 .pixel-app이 아직 DOM에 없을 수 있으므로
  // 마운트 이후(그리고 필요 시 DOM 변화 감지 후)에 컨테이너를 확정한다.
  const [container, setContainer] = React.useState<HTMLElement | null>(() =>
    resolvePixelAppContainer()
  );

  React.useLayoutEffect(() => {
    if (container) {
      return;
    }

    const resolved = resolvePixelAppContainer();
    if (resolved) {
      setContainer(resolved);
      return;
    }

    if (typeof MutationObserver === "undefined") {
      return;
    }

    const observer = new MutationObserver(() => {
      const nextContainer = resolvePixelAppContainer();
      if (nextContainer) {
        setContainer(nextContainer);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [container]);

  return (
    <DialogPortal container={container ?? undefined}>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "text-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 focus:outline-none",
          typeof className === "string" &&
            (className.includes("pixel-panel") ||
              className.includes("pixel-modal"))
            ? ""
            : "border-border/60 bg-background rounded-2xl border p-6 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
