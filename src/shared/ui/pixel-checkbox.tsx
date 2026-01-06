import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/utils";
import { PixelIcon } from "@/shared/ui/pixel-icon";

interface PixelCheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "className"> {
  className?: string;
}

export function PixelCheckbox({
  checked,
  defaultChecked,
  disabled,
  className,
  ...props
}: PixelCheckboxProps) {
  const isChecked = checked ?? defaultChecked ?? false;
  const inputProps: ComponentPropsWithoutRef<"input"> = {
    ...props,
    type: "checkbox",
    disabled,
  };

  if (checked !== undefined) {
    inputProps.checked = checked;
  } else if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }

  return (
    <label
      className={cn(
        "pixel-checkbox",
        isChecked && "pixel-checkbox--checked",
        className
      )}
    >
      <input className="sr-only" {...inputProps} />
      {isChecked ? (
        <PixelIcon name="check" className="pixel-checkbox__icon" />
      ) : null}
    </label>
  );
}
