import type {
  DungeonLogAction,
  DungeonLogCategory,
  DungeonLogDelta,
  DungeonLogEntry,
  DungeonLogRewardItem,
  DungeonLogStatus,
  DungeonLogStatsDelta,
} from "@/entities/dungeon-log/model/types";
import {
  formatDateTime,
  formatRelativeTime as formatRelativeTimeInternal,
} from "@/shared/lib/datetime/formatters";
import { formatStatChange, type StatTone } from "@/shared/lib/stats/format";
import { resolveBattleMonster } from "@/entities/dungeon-log/lib/monster";
import { i18next } from "@/shared/i18n/i18n";

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, options);

function translate(
  key: string,
  fallback?: string,
  options?: Record<string, unknown>
) {
  const value = t(key, options);
  return value === key ? (fallback ?? value) : value;
}

export function resolveActionLabel(action: DungeonLogAction): string {
  return translate(`logs.action.${action}`, action);
}

export function resolveStatusLabel(
  status: DungeonLogStatus,
  action: DungeonLogAction
): string {
  const statusKey = `logs.statusAction.${status}.${action}`;
  const statusLabel = t(statusKey);
  if (statusLabel !== statusKey) {
    return statusLabel;
  }

  const actionLabel = resolveActionLabel(action);
  const fallbackStatus = translate(
    `logs.status.fallback.${status}`,
    translate("logs.status.fallback.default")
  );
  return translate(
    "logs.status.actionFallback",
    `${actionLabel} ${fallbackStatus}`,
    {
      action: actionLabel,
      status: fallbackStatus,
    }
  );
}

export function resolveLogCategoryLabel(category: DungeonLogCategory): string {
  return translate(`logs.category.${category}`, category);
}

export const formatRelativeTime = formatRelativeTimeInternal;
export const formatLogTimestamp = formatDateTime;

export interface FormattedDeltaEntry {
  id: string;
  text: string;
  tone: StatTone;
}

type ItemNameResolver = (code: string, fallback?: string | null) => string;

export function formatDelta(
  entry: DungeonLogEntry,
  resolveItemName?: ItemNameResolver
): FormattedDeltaEntry[] {
  const { delta } = entry;
  const entries: FormattedDeltaEntry[] = [];

  if (!delta) {
    return entries;
  }

  switch (delta.type) {
    case "BATTLE": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      pushNumeric(entries, entry.id, "gold", delta.detail.rewards?.gold);
      pushProgress(entries, entry.id, delta.detail.progress?.delta);
      pushRewardItemsSummary(entries, entry.id, delta.detail.rewards?.items);
      break;
    }
    case "TREASURE": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      pushNumeric(entries, entry.id, "gold", delta.detail.rewards?.gold);
      pushProgress(entries, entry.id, delta.detail.progress?.delta);
      pushRewardItemsSummary(entries, entry.id, delta.detail.rewards?.items);
      break;
    }
    case "MOVE": {
      pushProgress(entries, entry.id, delta.detail.progress.delta);
      break;
    }
    case "REST":
    case "TRAP":
    case "DEATH": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      pushProgress(entries, entry.id, delta.detail.progress?.delta);
      break;
    }
    case "REVIVE": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      break;
    }
    case "ACQUIRE_ITEM":
    case "EQUIP_ITEM":
    case "UNEQUIP_ITEM":
    case "DISCARD_ITEM": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      entries.push(
        ...formatInventoryDelta(
          entry.id,
          delta.type,
          delta.detail.inventory,
          resolveItemName
        )
      );
      break;
    }
    case "LEVEL_UP": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      const skillPoints = delta.detail.rewards?.skillPoints;
      if (typeof skillPoints === "number" && skillPoints !== 0) {
        const prefix = skillPoints > 0 ? "+" : "";
        entries.push({
          id: `${entry.id}-skill-points`,
          text: t("logs.delta.skillPoints", {
            value: `${prefix}${skillPoints}`,
          }),
          tone: "gain",
        });
      }
      break;
    }
    case "BUFF_APPLIED": {
      const applied = delta.detail.applied ?? [];
      if (applied.length > 0) {
        entries.push({
          id: `${entry.id}-buff-applied`,
          text: t("logs.delta.buffApplied", { count: applied.length }),
          tone: "gain",
        });
      }
      break;
    }
    case "BUFF_EXPIRED": {
      const expired = delta.detail.expired ?? [];
      if (expired.length > 0) {
        entries.push({
          id: `${entry.id}-buff-expired`,
          text: t("logs.delta.buffExpired", { count: expired.length }),
          tone: "loss",
        });
      }
      break;
    }
    default: {
      break;
    }
  }

  return entries;
}

function pushNumeric(
  acc: FormattedDeltaEntry[],
  entryId: string,
  labelKey: string,
  value?: number | null
) {
  if (typeof value !== "number" || value === 0) {
    return;
  }
  const tone = value > 0 ? "gain" : "loss";
  const prefix = value > 0 ? "+" : "";
  const label = translate(`logs.delta.${labelKey}`, labelKey);
  acc.push({
    id: `${entryId}-${labelKey}-${acc.length}`,
    text: `${label} ${prefix}${value}`,
    tone,
  });
}

function pushProgress(
  acc: FormattedDeltaEntry[],
  entryId: string,
  value?: number | null
) {
  if (typeof value !== "number" || value === 0) {
    return;
  }
  const tone = value > 0 ? "gain" : "loss";
  const prefix = value > 0 ? "+" : "";
  acc.push({
    id: `${entryId}-progress-${acc.length}`,
    text: t("logs.delta.floorProgress", {
      value: `${prefix}${value}%`,
    }),
    tone,
  });
}

function pushRewardItemsSummary(
  acc: FormattedDeltaEntry[],
  entryId: string,
  items?: DungeonLogRewardItem[]
) {
  if (!items || items.length === 0) {
    return;
  }

  const count = items.reduce((total, item) => total + (item.quantity ?? 1), 0);
  acc.push({
    id: `${entryId}-reward-items`,
    text: t("logs.delta.itemSummary", { count }),
    tone: "gain",
  });
}

function formatStatsDelta(
  entryId: string,
  stats?: DungeonLogStatsDelta
): FormattedDeltaEntry[] {
  if (!stats) {
    return [];
  }

  return Object.entries(stats)
    .filter(([, value]) => typeof value === "number" && value !== 0)
    .map(([key, value]) => {
      const numericValue = value as number;
      const { text, tone } = formatStatChange(key, numericValue);
      return {
        id: `${entryId}-stat-${key}`,
        text,
        tone,
      } satisfies FormattedDeltaEntry;
    });
}

function formatInventoryDelta(
  entryId: string,
  action: DungeonLogDelta["type"],
  inventory: {
    added?: Array<{ code: string; quantity?: number }>;
    removed?: Array<{ code: string; quantity?: number }>;
    equipped?: { code: string };
    unequipped?: { code: string };
  },
  resolveItemName?: ItemNameResolver
): FormattedDeltaEntry[] {
  const entries: FormattedDeltaEntry[] = [];
  const resolveName = (code: string) =>
    resolveItemName ? resolveItemName(code, code) : code;

  if (inventory.equipped?.code) {
    const itemName = resolveName(inventory.equipped.code);
    entries.push({
      id: `${entryId}-equipped`,
      text: t("logs.delta.equipped", { item: itemName }),
      tone: "gain",
    });
  }

  if (inventory.unequipped?.code) {
    const itemName = resolveName(inventory.unequipped.code);
    entries.push({
      id: `${entryId}-unequipped`,
      text: t("logs.delta.unequipped", { item: itemName }),
      tone: "loss",
    });
  }

  for (const item of inventory.added ?? []) {
    const itemName = resolveName(item.code);
    const quantity = item.quantity ?? 1;
    entries.push({
      id: `${entryId}-added-${item.code}`,
      text: t("logs.delta.acquired", {
        item: itemName,
        count: quantity,
      }),
      tone: "gain",
    });
  }

  for (const item of inventory.removed ?? []) {
    const itemName = resolveName(item.code);
    const quantity = item.quantity ?? 1;
    entries.push({
      id: `${entryId}-removed-${item.code}`,
      text: t("logs.delta.removed", {
        item: itemName,
        count: quantity,
      }),
      tone: "loss",
    });
  }

  return entries;
}

export function buildLogDescription(
  entry: DungeonLogEntry,
  resolveItemName?: ItemNameResolver
): string {
  const { delta } = entry;
  const resolveName = (code: string) =>
    resolveItemName ? resolveItemName(code, code) : code;

  // EQUIP_ITEM/UNEQUIP_ITEM일 때 별도 형식
  if (delta?.type === "EQUIP_ITEM" || delta?.type === "UNEQUIP_ITEM") {
    const messages: string[] = [];
    const inventory = delta.detail.inventory;

    if (inventory.unequipped?.code) {
      const itemName = resolveName(inventory.unequipped.code);
      messages.push(t("logs.message.unequipped", { item: itemName }));
    }
    if (inventory.equipped?.code) {
      const itemName = resolveName(inventory.equipped.code);
      messages.push(t("logs.message.equipped", { item: itemName }));
    }

    // 스탯 변화만 delta로 표시
    const statsDelta = formatStatsDelta(entry.id, delta.detail.stats);
    if (statsDelta.length > 0) {
      const statsText = statsDelta.map((s) => s.text).join(", ");
      return `${messages.join(", ")} (${statsText})`;
    }

    return messages.join(", ");
  }

  // 기존 로직
  const statusLabel = resolveStatusLabel(entry.status, entry.action);
  const detailsLabel = buildDetailsAttachment(entry);
  const deltaEntries = formatDelta(entry, resolveItemName).map(
    (item) => item.text
  );

  if (deltaEntries.length === 0) {
    return detailsLabel ? `${statusLabel} ${detailsLabel}` : statusLabel;
  }

  const base = `${statusLabel} (${deltaEntries.join(", ")})`;
  return detailsLabel ? `${base} ${detailsLabel}` : base;
}

function buildDetailsAttachment(entry: DungeonLogEntry): string | undefined {
  const monster = resolveBattleMonster(entry);
  if (monster?.name) {
    return t("logs.detail.opponent", { name: monster.name });
  }

  return undefined;
}
