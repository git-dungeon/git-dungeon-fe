import type { StatTone } from "@/shared/lib/stats/format";

export const BADGE_TONE_CLASSES: Record<StatTone, string> = {
  gain: "border-emerald-500 text-emerald-600",
  loss: "border-rose-500 text-rose-600",
  neutral: "border-border text-foreground",
};
