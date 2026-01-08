import { cn } from "@/shared/lib/utils";
import type { EmbedPreviewSize } from "@/entities/embed/model/types";

const containerBaseClass =
  "border-border bg-background text-foreground max-w-full space-y-4 rounded-3xl border shadow-sm";

const containerSizeClassMap: Record<EmbedPreviewSize, string> = {
  compact: "px-6 py-8",
  wide: "px-10 py-10",
};

const containerAspectClassMap: Record<EmbedPreviewSize, string> = {
  compact: "aspect-[8/3]",
  wide: "aspect-[4/1]",
};

export function getEmbedPreviewContainerClass(size: EmbedPreviewSize) {
  return cn(containerBaseClass, containerSizeClassMap[size]);
}

export function getEmbedPreviewAspectClass(size: EmbedPreviewSize) {
  return containerAspectClassMap[size];
}
