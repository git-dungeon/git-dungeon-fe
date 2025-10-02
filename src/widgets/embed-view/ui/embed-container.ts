import { cn } from "@/shared/lib/utils";
import type { EmbedPreviewSize } from "@/entities/embed/model/types";

const containerBaseClass =
  "border-border bg-background text-foreground max-w-full space-y-4 rounded-3xl border shadow-sm";

const containerSizeClassMap: Record<EmbedPreviewSize, string> = {
  compact: "w-[480px] px-6 py-8",
  square: "w-[720px] px-8 py-9",
  wide: "w-[960px] px-10 py-10",
};

export function getEmbedPreviewContainerClass(size: EmbedPreviewSize) {
  return cn(containerBaseClass, containerSizeClassMap[size]);
}
