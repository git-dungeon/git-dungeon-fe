import type { ComponentProps } from "react";
import { useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/shared/lib/utils";

type PixelSliderProps = ComponentProps<typeof SliderPrimitive.Root>;

export function PixelSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: PixelSliderProps) {
  const values = useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }
    return [min, max];
  }, [defaultValue, max, min, value]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "pixel-slider relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="absolute" />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
