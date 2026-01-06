import type { SVGProps } from "react";
import { cn } from "@/shared/lib/utils";

type PixelIconName = "copy" | "close" | "arrow-up" | "arrow-down" | "check";

interface PixelIconProps extends SVGProps<SVGSVGElement> {
  name: PixelIconName;
  size?: number;
}

const ICON_PATHS: Record<PixelIconName, string[]> = {
  copy: [
    "M16 20v2h-1v1H3v-1H2V6h1V5h3v15z",
    "M16 7V1H8v1H7v16h1v1h13v-1h1V7zm4 10H9V3h5v6h6z",
    "M22 5v1h-5V1h1v1h1v1h1v1h1v1z",
  ],
  close: [
    "M5 5h2v2H5zm4 4H7V7h2zm2 2H9V9h2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2zm2-2v2h-2V9zm2-2v2h-2V7zm0 0V5h2v2z",
  ],
  "arrow-up": [
    "M11 1h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1V9h-1V8h-1v15h-4V8H9v1H8v1H7v1H6v1H5v1H4v1H3v-1H2v-1H1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h1V4h1V3h1V2h1z",
  ],
  "arrow-down": [
    "M13 23h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3v-1H2v-1H1v-1h1v-1h1v-1h1v1h1v1h1v1h1v1h1v1h1v1h1V1h4v15h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v1h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1z",
  ],
  check: [
    "M23 5v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H8v-1H7v-1H6v-1H5v-1H4v-1H3v-1H2v-1H1v-1h1v-1h1V9h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h1V4h1V3h1v1h1v1z",
  ],
};

export function PixelIcon({
  name,
  size = 12,
  className,
  ...props
}: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("pixel-icon", className)}
      fill="currentColor"
      {...props}
    >
      {ICON_PATHS[name].map((path, index) => (
        <path key={`${name}-${index}`} d={path} />
      ))}
    </svg>
  );
}
