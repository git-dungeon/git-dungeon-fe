import type {
  LogBattlePlayerSnapshot,
  LogEntry,
  LogMonster,
} from "@/entities/logs/model/types";

type BattleExtra = Extract<LogEntry["extra"], { type: "BATTLE" }>;
type BattleDetails = BattleExtra["details"];
type BattleResult = BattleDetails["result"];
type BattlePlayer = LogBattlePlayerSnapshot;

function resolveBattleExtra(entry: LogEntry): BattleExtra | undefined {
  if (entry.extra?.type === "BATTLE") {
    return entry.extra as BattleExtra;
  }
  return undefined;
}

export function resolveBattleMonster(entry: LogEntry): LogMonster | undefined {
  const extra = resolveBattleExtra(entry);
  if (!extra) {
    return undefined;
  }

  const details = extra.details as BattleDetails | undefined;
  const monster =
    details?.monster ??
    (extra as { detail?: { monster?: LogMonster } }).detail?.monster ??
    (extra as { monster?: LogMonster }).monster;

  return monster;
}

export function resolveBattleResult(entry: LogEntry): BattleResult | undefined {
  const extra = resolveBattleExtra(entry);
  if (!extra) {
    return undefined;
  }

  const details = extra.details as BattleDetails | undefined;
  const result =
    details?.result ??
    (extra as { detail?: { result?: BattleResult } }).detail?.result;

  return result;
}

export function resolveBattlePlayer(entry: LogEntry): BattlePlayer | undefined {
  const extra = resolveBattleExtra(entry);
  if (!extra) {
    return undefined;
  }

  const details = extra.details as BattleDetails | undefined;
  const player =
    details?.player ??
    (extra as { detail?: { player?: BattlePlayer } }).detail?.player ??
    (extra as { player?: BattlePlayer }).player;

  return player;
}
