import type {
  DungeonLogAction,
  DungeonLogCategory,
  DungeonLogEntry,
  DungeonLogInventoryDelta,
  DungeonLogRewardItem,
  DungeonLogStatus,
  DungeonLogStatsDelta,
} from "@/entities/dungeon-log/model/types";
import {
  formatDateTime,
  formatRelativeTime as formatRelativeTimeInternal,
} from "@/shared/lib/datetime/formatters";
import { formatStatChange, type StatTone } from "@/shared/lib/stats/format";
import {
  resolveBattleMonster,
  resolveBattleResult,
} from "@/entities/dungeon-log/lib/monster";
import { resolveStoryMessage } from "@/entities/dungeon-log/lib/story";
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
  icon?: "count" | "plus" | "minus";
}

type ItemNameResolver = (code: string, fallback?: string | null) => string;
type MonsterNameResolver = (code: string, fallback?: string | null) => string;

export interface LogDescriptionResolvers {
  resolveItemName?: ItemNameResolver;
  resolveMonsterName?: MonsterNameResolver;
}

export function formatDelta(
  entry: DungeonLogEntry,
  options: { resolveItemName?: ItemNameResolver } = {}
): FormattedDeltaEntry[] {
  const { delta } = entry;
  const entries: FormattedDeltaEntry[] = [];
  const { resolveItemName } = options;

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
      const floorDelta =
        typeof delta.detail.fromFloor === "number" &&
        typeof delta.detail.toFloor === "number"
          ? delta.detail.toFloor - delta.detail.fromFloor
          : undefined;
      pushNumeric(entries, entry.id, "floor", floorDelta);
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
    icon: "count",
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
  inventory: DungeonLogInventoryDelta,
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
      icon: "plus",
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
      icon: "minus",
    });
  }

  return entries;
}

export function buildLogDescription(
  entry: DungeonLogEntry,
  { resolveItemName, resolveMonsterName }: LogDescriptionResolvers = {}
): string {
  const monster = resolveBattleMonster(entry);
  const monsterName = monster
    ? resolveMonsterName
      ? resolveMonsterName(monster.code, monster.name)
      : monster.name
    : undefined;
  const storyMessage = resolveStoryMessage(entry, { monsterName });
  const resultLabel = resolveBattleResultLabel(entry);
  const statusLabel =
    resultLabel ??
    storyMessage?.text ??
    resolveStatusLabel(entry.status, entry.action);
  const detailsLabel = buildDetailsAttachment(entry, {
    monsterName,
    omitOpponent: Boolean(!resultLabel && storyMessage?.usesMonster),
    resolveMonsterName,
  });
  const deltaEntries = formatDelta(entry, { resolveItemName }).map(
    (item) => item.text
  );

  if (deltaEntries.length === 0) {
    return detailsLabel ? `${statusLabel} ${detailsLabel}` : statusLabel;
  }

  const base = `${statusLabel} (${deltaEntries.join(", ")})`;
  return detailsLabel ? `${base} ${detailsLabel}` : base;
}

function buildDetailsAttachment(
  entry: DungeonLogEntry,
  options: {
    monsterName?: string | null;
    omitOpponent?: boolean;
    resolveMonsterName?: MonsterNameResolver;
  } = {}
): string | undefined {
  const attachments: string[] = [];

  if (!options.omitOpponent) {
    const monsterName = options.monsterName;
    if (monsterName) {
      attachments.push(t("logs.detail.opponent", { name: monsterName }));
    }
  }

  const deathCause = resolveDeathCauseLabel(entry);
  const deathSource = resolveDeathHandledByLabel(
    entry,
    options.resolveMonsterName
  );
  if (deathCause) {
    if (deathSource) {
      attachments.push(
        t("logs.detail.deathCauseWithSource", {
          cause: deathCause,
          source: deathSource,
        })
      );
    } else {
      attachments.push(t("logs.detail.deathCause", { cause: deathCause }));
    }
  }

  return attachments.length > 0 ? attachments.join(" ") : undefined;
}

function resolveBattleResultLabel(entry: DungeonLogEntry): string | undefined {
  if (entry.action !== "BATTLE" || entry.status !== "COMPLETED") {
    return undefined;
  }

  const result = resolveBattleResult(entry);
  if (!result) {
    return undefined;
  }

  const key = `logs.result.${result}`;
  const label = translate(key);
  return label === key ? undefined : label;
}

function resolveDeathCauseLabel(entry: DungeonLogEntry): string | undefined {
  if (entry.extra?.type !== "DEATH") {
    return undefined;
  }

  const cause = resolveDeathCause(entry);
  if (!cause) {
    return undefined;
  }

  const key = `logs.deathCause.${cause}`;
  const label = translate(key, cause);
  if (label !== cause) {
    return label;
  }

  if (/^[A-Z0-9_]+$/.test(cause)) {
    return cause
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return cause;
}

function resolveDeathCause(entry: DungeonLogEntry): string | undefined {
  const extra = entry.extra as { details?: { cause?: string } };
  if (extra.details?.cause) {
    return extra.details.cause;
  }

  const legacy = entry.extra as {
    detail?: { cause?: string };
    cause?: string;
  };

  return legacy.detail?.cause ?? legacy.cause;
}

function resolveDeathHandledByLabel(
  entry: DungeonLogEntry,
  resolveMonsterName?: MonsterNameResolver
): string | undefined {
  if (entry.extra?.type !== "DEATH") {
    return undefined;
  }

  const handledBy = resolveDeathHandledBy(entry);
  if (!handledBy) {
    return undefined;
  }

  if (resolveMonsterName) {
    return resolveMonsterName(handledBy, handledBy);
  }

  return handledBy;
}

function resolveDeathHandledBy(entry: DungeonLogEntry): string | undefined {
  const extra = entry.extra as { details?: { handledBy?: string } };
  if (extra.details?.handledBy) {
    return extra.details.handledBy;
  }

  const legacy = entry.extra as {
    detail?: { handledBy?: string };
    handledBy?: string;
  };

  return legacy.detail?.handledBy ?? legacy.handledBy;
}
