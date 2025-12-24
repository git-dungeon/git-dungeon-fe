import type {
  DungeonLogEntry,
  DungeonLogBattlePlayerSnapshot,
  DungeonLogMonster,
} from "@/entities/dungeon-log/model/types";

type BattleExtra = Extract<DungeonLogEntry["extra"], { type: "BATTLE" }>;
type BattleDetails = BattleExtra["details"];
type BattleResult = BattleDetails["result"];
type BattlePlayer = DungeonLogBattlePlayerSnapshot;

function resolveBattleExtra(entry: DungeonLogEntry): BattleExtra | undefined {
  if (entry.extra?.type === "BATTLE") {
    return entry.extra as BattleExtra;
  }
  return undefined;
}

export function resolveBattleMonster(
  entry: DungeonLogEntry
): DungeonLogMonster | undefined {
  const extra = resolveBattleExtra(entry);
  if (!extra) {
    return undefined;
  }

  const details = extra.details as BattleDetails | undefined;
  const monster =
    details?.monster ??
    (extra as { detail?: { monster?: DungeonLogMonster } }).detail?.monster ??
    (extra as { monster?: DungeonLogMonster }).monster;

  return monster;
}

export function resolveBattleResult(
  entry: DungeonLogEntry
): BattleResult | undefined {
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

export function resolveBattlePlayer(
  entry: DungeonLogEntry
): BattlePlayer | undefined {
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
