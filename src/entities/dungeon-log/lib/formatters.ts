import type {
  DungeonAction,
  DungeonLogDelta,
  DungeonLogEntry,
  DungeonLogStatus,
} from "@/entities/dungeon-log/model/types";

const ACTION_LABEL_MAP: Record<DungeonAction, string> = {
  battle: "전투",
  treasure: "보물",
  empty: "빈 방",
  rest: "휴식",
  trap: "함정",
  move: "층 이동",
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
  },
  completed: {
    battle: "전투에서 승리했습니다",
    treasure: "보물을 획득했습니다",
    trap: "함정을 무사히 넘겼습니다",
    empty: "아무 일도 일어나지 않았습니다",
    rest: "휴식을 마쳤습니다",
    move: "다음 층으로 진입했습니다",
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

export function formatRelativeTime(iso: string): string {
  const targetTime = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - targetTime;

  if (Number.isNaN(targetTime) || diff < 0) {
    return "방금";
  }

  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 1) {
    return "방금";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function formatDelta(delta: DungeonLogDelta): string[] {
  const entries: string[] = [];
  if (typeof delta.ap === "number" && delta.ap !== 0) {
    entries.push(formatDeltaEntry("AP", delta.ap));
  }
  if (typeof delta.hp === "number" && delta.hp !== 0) {
    entries.push(formatDeltaEntry("HP", delta.hp));
  }
  if (typeof delta.gold === "number" && delta.gold !== 0) {
    entries.push(formatDeltaEntry("Gold", delta.gold));
  }
  if (typeof delta.exp === "number" && delta.exp !== 0) {
    entries.push(formatDeltaEntry("EXP", delta.exp));
  }
  if (typeof delta.progress === "number" && delta.progress !== 0) {
    entries.push(formatProgressDelta(delta.progress));
  }
  if (delta.item) {
    entries.push(`아이템 ${delta.item}`);
  }
  return entries;
}

function formatDeltaEntry(label: string, value: number): string {
  const valuePrefix = value > 0 ? "+" : "";
  return `${label} ${valuePrefix}${value}`;
}

function formatProgressDelta(value: number): string {
  const valuePrefix = value > 0 ? "+" : "";
  return `층 진행도 ${valuePrefix}${value}%`;
}

export function buildLogDescription(entry: DungeonLogEntry): string {
  const statusLabel = resolveStatusLabel(entry.status, entry.action);
  const deltaEntries = formatDelta(entry.delta);

  if (deltaEntries.length === 0) {
    return statusLabel;
  }

  return `${statusLabel} (${deltaEntries.join(", ")})`;
}
