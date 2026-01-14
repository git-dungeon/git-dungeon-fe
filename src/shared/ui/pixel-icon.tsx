import type { SVGProps } from "react";
import { cn } from "@/shared/lib/utils";

type PixelIconName =
  | "copy"
  | "close"
  | "arrow-up"
  | "arrow-down"
  | "check"
  | "item-count"
  | "plus"
  | "minus"
  | "github";

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
  "item-count": [
    "M23 11v2h-1v1h-8v8h-1v1h-2v-1h-1v-8H2v-1H1v-2h1v-1h8V2h1V1h2v1h1v8h8v1z",
  ],
  plus: [
    "M23 11v2h-1v1h-8v8h-1v1h-2v-1h-1v-8H2v-1H1v-2h1v-1h8V2h1V1h2v1h1v8h8v1z",
  ],
  minus: ["M23 11v2h-1v1H2v-1H1v-2h1v-1h20v1z"],
  github: [
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.624-5.476 5.921.431.372.815 1.103.815 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
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
