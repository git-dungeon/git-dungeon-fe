import { cn } from "@/shared/lib/utils";
import type { EmbedPreviewSize } from "@/entities/embed/model/types";

const containerBaseClass =
  "border-border bg-background text-foreground max-w-full space-y-4 rounded-3xl border shadow-sm";

const containerSizeClassMap: Record<EmbedPreviewSize, string> = {
  compact: "px-6 py-8",
  square: "px-8 py-9",
  wide: "px-10 py-10",
};

export function getEmbedPreviewContainerClass(size: EmbedPreviewSize) {
  return cn(containerBaseClass, containerSizeClassMap[size]);
}
