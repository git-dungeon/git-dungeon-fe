import type {
  DungeonLogAction,
  DungeonLogCategory,
  DungeonLogDelta,
  DungeonLogEntry,
  DungeonLogStatus,
  DungeonLogStatsDelta,
} from "@/entities/dungeon-log/model/types";
import {
  formatDateTime,
  formatRelativeTime as formatRelativeTimeInternal,
} from "@/shared/lib/datetime/formatters";
import {
  determineItemTone,
  formatStatChange,
  type StatTone,
} from "@/shared/lib/stats/format";

const ACTION_LABEL_MAP: Record<DungeonLogAction, string> = {
  BATTLE: "전투",
  TREASURE: "보물",
  REST: "휴식",
  TRAP: "함정",
  MOVE: "이동",
  DEATH: "사망",
  REVIVE: "부활",
  ACQUIRE_ITEM: "아이템 획득",
  EQUIP_ITEM: "장착",
  UNEQUIP_ITEM: "해제",
  DISCARD_ITEM: "버리기",
  BUFF_APPLIED: "버프 적용",
  BUFF_EXPIRED: "버프 종료",
  LEVEL_UP: "레벨 업",
};

const STATUS_ACTION_LABEL_MAP: Record<
  DungeonLogStatus,
  Partial<Record<DungeonLogAction, string>>
> = {
  STARTED: {
    BATTLE: "전투를 시작했습니다",
    TREASURE: "보물을 조사하기 시작했습니다",
    TRAP: "함정을 살펴보기 시작했습니다",
    REST: "휴식을 준비합니다",
    MOVE: "다음 행동을 준비합니다",
    DEATH: "사망 처리 중입니다",
    REVIVE: "부활 처리 중입니다",
    ACQUIRE_ITEM: "아이템을 획득합니다",
    EQUIP_ITEM: "아이템을 장착합니다",
    UNEQUIP_ITEM: "아이템을 해제합니다",
    DISCARD_ITEM: "아이템을 버립니다",
    BUFF_APPLIED: "버프가 적용됩니다",
    BUFF_EXPIRED: "버프가 종료됩니다",
    LEVEL_UP: "레벨 업을 준비합니다",
  },
  COMPLETED: {
    BATTLE: "전투를 완료했습니다",
    TREASURE: "보물을 획득했습니다",
    TRAP: "함정을 무사히 넘겼습니다",
    REST: "휴식을 마쳤습니다",
    MOVE: "이동을 완료했습니다",
    DEATH: "사망했습니다",
    REVIVE: "부활했습니다",
    ACQUIRE_ITEM: "아이템을 획득했습니다",
    EQUIP_ITEM: "아이템을 장착했습니다",
    UNEQUIP_ITEM: "아이템을 해제했습니다",
    DISCARD_ITEM: "아이템을 버렸습니다",
    BUFF_APPLIED: "버프가 적용되었습니다",
    BUFF_EXPIRED: "버프가 종료되었습니다",
    LEVEL_UP: "레벨이 올랐습니다",
  },
};

const STATUS_FALLBACK_LABEL: Record<DungeonLogStatus, string> = {
  STARTED: "행동을 시작했습니다",
  COMPLETED: "행동을 완료했습니다",
};

export function resolveActionLabel(action: DungeonLogAction): string {
  return ACTION_LABEL_MAP[action] ?? action;
}

export function resolveStatusLabel(
  status: DungeonLogStatus,
  action: DungeonLogAction
): string {
  const statusLabel = STATUS_ACTION_LABEL_MAP[status]?.[action];
  if (statusLabel) {
    return statusLabel;
  }

  const actionLabel = resolveActionLabel(action);
  return `${actionLabel}을(를) ${STATUS_FALLBACK_LABEL[status] ?? "진행했습니다"}`;
}

export function resolveLogCategoryLabel(category: DungeonLogCategory): string {
  switch (category) {
    case "EXPLORATION":
      return "탐험 로그";
    case "STATUS":
      return "상태 로그";
    default:
      return category;
  }
}

export const formatRelativeTime = formatRelativeTimeInternal;
export const formatLogTimestamp = formatDateTime;

export interface FormattedDeltaEntry {
  id: string;
  text: string;
  tone: StatTone;
}

export function formatDelta(entry: DungeonLogEntry): FormattedDeltaEntry[] {
  const { delta } = entry;
  const entries: FormattedDeltaEntry[] = [];

  if (!delta) {
    return entries;
  }

  switch (delta.type) {
    case "BATTLE": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      pushNumeric(entries, entry.id, "Gold", delta.detail.rewards?.gold);
      pushProgress(entries, entry.id, delta.detail.progress?.delta);
      break;
    }
    case "TREASURE": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      pushNumeric(entries, entry.id, "Gold", delta.detail.rewards?.gold);
      pushProgress(entries, entry.id, delta.detail.progress?.delta);

      const rewardItems = delta.detail.rewards?.items ?? [];
      if (rewardItems.length > 0) {
        const count = rewardItems.reduce(
          (acc, item) => acc + (item.quantity ?? 1),
          0
        );
        entries.push({
          id: `${entry.id}-reward-items`,
          text: `아이템 ${count}개`,
          tone: "gain",
        });
      }
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
        ...formatInventoryDelta(entry.id, delta.type, delta.detail.inventory)
      );
      break;
    }
    case "LEVEL_UP": {
      entries.push(...formatStatsDelta(entry.id, delta.detail.stats));
      const skillPoints = delta.detail.rewards?.skillPoints;
      if (typeof skillPoints === "number" && skillPoints !== 0) {
        entries.push({
          id: `${entry.id}-skill-points`,
          text: `스킬 포인트 +${skillPoints}`,
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
          text: `버프 +${applied.length}`,
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
          text: `버프 -${expired.length}`,
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
  label: string,
  value?: number | null
) {
  if (typeof value !== "number" || value === 0) {
    return;
  }
  const tone = value > 0 ? "gain" : "loss";
  const prefix = value > 0 ? "+" : "";
  acc.push({
    id: `${entryId}-${label.toLowerCase()}-${acc.length}`,
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
    text: `층 진행도 ${prefix}${value}%`,
    tone,
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
  }
): FormattedDeltaEntry[] {
  const tone = determineItemTone(action);
  const entries: FormattedDeltaEntry[] = [];

  if (inventory.equipped?.code) {
    entries.push({
      id: `${entryId}-equipped`,
      text: `장착 ${inventory.equipped.code}`,
      tone,
    });
  }

  if (inventory.unequipped?.code) {
    entries.push({
      id: `${entryId}-unequipped`,
      text: `해제 ${inventory.unequipped.code}`,
      tone,
    });
  }

  for (const item of inventory.added ?? []) {
    const quantity = item.quantity ?? 1;
    entries.push({
      id: `${entryId}-added-${item.code}`,
      text: `획득 ${item.code} x${quantity}`,
      tone: "gain",
    });
  }

  for (const item of inventory.removed ?? []) {
    const quantity = item.quantity ?? 1;
    entries.push({
      id: `${entryId}-removed-${item.code}`,
      text: `제거 ${item.code} x${quantity}`,
      tone: "loss",
    });
  }

  return entries;
}

export function buildLogDescription(entry: DungeonLogEntry): string {
  const statusLabel = resolveStatusLabel(entry.status, entry.action);
  const detailsLabel = buildDetailsAttachment(entry);
  const deltaEntries = formatDelta(entry).map((item) => item.text);

  if (deltaEntries.length === 0) {
    return detailsLabel ? `${statusLabel} ${detailsLabel}` : statusLabel;
  }

  const base = `${statusLabel} (${deltaEntries.join(", ")})`;
  return detailsLabel ? `${base} ${detailsLabel}` : base;
}

function buildDetailsAttachment(entry: DungeonLogEntry): string | undefined {
  const extra = entry.extra;

  if (extra?.type === "BATTLE") {
    const monster = extra.details?.monster;
    return monster?.name ? `상대: ${monster.name}` : undefined;
  }

  return undefined;
}
