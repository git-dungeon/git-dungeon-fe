import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "pixel-toast",
          title: "pixel-text-base",
          description: "pixel-text-muted text-xs",
          actionButton: "pixel-button pixel-button--compact",
          cancelButton: "pixel-button pixel-button--compact",
        },
      }}
      {...props}
    />
  );
}
