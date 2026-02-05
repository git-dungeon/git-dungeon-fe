import {
  MAX_FLOOR_PROGRESS_CHART,
  MAX_FLOOR_PROGRESS_DISPLAY,
  MAX_PERCENT,
  MIN_FLOOR_PROGRESS,
  MIN_PERCENT,
} from "@/entities/dashboard/config/constants";
import { clampPercent } from "@/shared/lib/math";

export { clampPercent };

export function calcPercent(current: number, max: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) {
    return MIN_PERCENT;
  }

  const percent = (current / max) * MAX_PERCENT;
  return clampPercent(percent);
}

export function roundPercent(value: number): number {
  return Math.round(clampPercent(value));
}

export function calcRoundedPercent(current: number, max: number): number {
  return roundPercent(calcPercent(current, max));
}

export function clampFloorProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return MIN_FLOOR_PROGRESS;
  }

  return Math.max(progress, MIN_FLOOR_PROGRESS);
}

export function getDisplayFloorProgress(progress: number): number {
  return Math.min(clampFloorProgress(progress), MAX_FLOOR_PROGRESS_DISPLAY);
}

export function getChartFloorProgress(progress: number): number {
  return Math.min(clampFloorProgress(progress), MAX_FLOOR_PROGRESS_CHART);
}
