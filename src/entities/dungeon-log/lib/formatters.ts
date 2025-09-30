import type {
  DungeonAction,
  DungeonLogCategory,
  DungeonLogDelta,
  DungeonLogEntry,
  DungeonLogStatus,
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

const ACTION_LABEL_MAP: Record<DungeonAction, string> = {
  battle: "전투",
  treasure: "보물",
  empty: "빈 방",
  rest: "휴식",
  trap: "함정",
  move: "층 이동",
  equip: "장착",
  unequip: "해제",
  discard: "버리기",
};

const STATUS_ACTION_LABEL_MAP: Record<
  DungeonLogStatus,
  Partial<Record<DungeonAction, string>>
> = {
  started: {
    battle: "전투를 시작했습니다",
    treasure: "보물을 조사하기 시작했습니다",
    trap: "함정을 살펴보기 시작했습니다",
    empty: "탐색을 시작했습니다",
    rest: "휴식을 준비합니다",
    move: "다음 층으로 이동을 준비합니다",
    equip: "아이템을 장착합니다",
    unequip: "아이템을 해제합니다",
    discard: "아이템을 버립니다",
  },
  completed: {
    battle: "전투에서 승리했습니다",
    treasure: "보물을 획득했습니다",
    trap: "함정을 무사히 넘겼습니다",
    empty: "아무 일도 일어나지 않았습니다",
    rest: "휴식을 마쳤습니다",
    move: "다음 층으로 진입했습니다",
    equip: "아이템을 장착했습니다",
    unequip: "아이템을 해제했습니다",
    discard: "아이템을 버렸습니다",
  },
};

const STATUS_FALLBACK_LABEL: Record<DungeonLogStatus, string> = {
  started: "행동을 시작했습니다",
  completed: "행동을 완료했습니다",
};

export function resolveActionLabel(action: DungeonAction): string {
  return ACTION_LABEL_MAP[action] ?? action;
}

export function resolveStatusLabel(
  status: DungeonLogStatus,
  action: DungeonAction
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
    case "exploration":
      return "탐험 로그";
    case "status":
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

  pushNumeric(entries, entry.id, "AP", delta.ap);
  pushNumeric(entries, entry.id, "HP", delta.hp);
  pushNumeric(entries, entry.id, "Gold", delta.gold);
  pushNumeric(entries, entry.id, "EXP", delta.exp);
  pushProgress(entries, entry.id, delta.progress);

  if (delta.item) {
    entries.push({
      id: `${entry.id}-item`,
      text: `아이템 ${delta.item}`,
      tone: resolveItemTone(entry.action),
    });
  }

  if (delta.stats) {
    entries.push(...formatStatsDelta(entry.id, delta.stats));
  }

  return entries;
}

function pushNumeric(
  acc: FormattedDeltaEntry[],
  entryId: string,
  label: string,
  value?: number
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
  value?: number
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
  stats: NonNullable<DungeonLogDelta["stats"]>
): FormattedDeltaEntry[] {
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

function resolveItemTone(action: DungeonAction): StatTone {
  return determineItemTone(action);
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
  if (entry.details?.type === "battle") {
    const { monster } = entry.details;
    return monster.name ? `상대: ${monster.name}` : undefined;
  }

  return undefined;
}
