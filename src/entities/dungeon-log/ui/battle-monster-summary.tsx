import type {
  DungeonLogBattlePlayerSnapshot,
  DungeonLogMonster,
} from "@/entities/dungeon-log/model/types";
import { useProfile } from "@/entities/profile/model/use-profile";
import { resolveMonsterThumbnail } from "@/entities/dungeon-log/config/thumbnails";
import { cn } from "@/shared/lib/utils";

type BattleResult = "VICTORY" | "DEFEAT";

interface BattleMonsterSummaryProps {
  monster?: DungeonLogMonster;
  player?: DungeonLogBattlePlayerSnapshot;
  result?: BattleResult;
  size?: "compact" | "detail";
  resolveMonsterName?: (code: string, fallback?: string | null) => string;
}

const RESULT_LABEL_MAP: Record<BattleResult, string> = {
  VICTORY: "승리",
  DEFEAT: "패배",
};

export function BattleMonsterSummary({
  monster,
  player,
  result,
  size = "compact",
  resolveMonsterName,
}: BattleMonsterSummaryProps) {
  const profile = useProfile();
  const profileName =
    profile.data?.profile.displayName ?? profile.data?.profile.username;
  const profileAvatar = profile.data?.profile.avatarUrl;
  const profileInitials = resolveInitials(profileName);

  if (!monster && !player) {
    return null;
  }

  const image = monster
    ? resolveMonsterThumbnail(monster.spriteId, monster.code)
    : undefined;
  const monsterName = monster
    ? resolveMonsterName
      ? resolveMonsterName(monster.code, monster.name)
      : monster.name
    : undefined;
  const monsterLabel = monsterName ?? "몬스터";
  const monsterStats = [
    { label: "HP", value: monster?.hp },
    { label: "ATK", value: monster?.atk },
    { label: "DEF", value: monster?.def },
  ].filter((stat) => typeof stat.value === "number");

  const playerStats = player
    ? [
        {
          label: "LV",
          base: String(player.level),
          bonus: undefined as string | undefined,
          bonusTone: undefined as "gain" | "loss" | undefined,
        },
        {
          label: "HP",
          base:
            typeof player.hp === "number" && typeof player.maxHp === "number"
              ? `${player.hp}/${player.maxHp}`
              : undefined,
          bonus: undefined as string | undefined,
          bonusTone: undefined as "gain" | "loss" | undefined,
        },
        {
          label: "ATK",
          ...formatStatValue(player.atk, player.stats?.equipmentBonus?.atk),
        },
        {
          label: "DEF",
          ...formatStatValue(player.def, player.stats?.equipmentBonus?.def),
        },
        {
          label: "LUCK",
          ...formatStatValue(player.luck, player.stats?.equipmentBonus?.luck),
        },
      ].filter((stat) => typeof stat.base === "string")
    : [];

  return (
    <div
      className={cn(
        "grid gap-3",
        size === "detail" ? "sm:grid-cols-2" : "grid-cols-1"
      )}
    >
      {player ? (
        <div
          className={cn(
            "border-border bg-muted/40 flex items-start gap-3 rounded-md border p-3",
            size === "detail" ? "items-start" : "items-center"
          )}
        >
          <div
            className={cn(
              "border-border bg-muted text-muted-foreground flex shrink-0 items-center justify-center overflow-hidden rounded-md border",
              size === "detail" ? "h-16 w-16" : "h-10 w-10"
            )}
          >
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt="유저 아바타"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-xs font-semibold">{profileInitials}</span>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-foreground text-sm font-semibold">
                {profileName ?? "유저"}
              </p>
            </div>
            {playerStats.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {playerStats.map((stat) => (
                  <span
                    key={stat.label}
                    className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[11px] font-medium"
                  >
                    {stat.label} {stat.base}
                    {stat.bonus && (
                      <span
                        className={cn(
                          "ml-0.5",
                          stat.bonusTone === "gain" &&
                            "text-emerald-600 dark:text-emerald-400",
                          stat.bonusTone === "loss" &&
                            "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        ({stat.bonus})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {monster ? (
        <div
          className={cn(
            "border-border bg-muted/40 flex items-start gap-3 rounded-md border p-3",
            size === "detail" ? "items-start" : "items-center"
          )}
        >
          {image ? (
            <div
              className={cn(
                "border-border bg-muted shrink-0 overflow-hidden rounded-md border",
                size === "detail" ? "h-16 w-16" : "h-10 w-10"
              )}
            >
              <img
                src={image}
                alt={monsterLabel}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-foreground text-sm font-semibold">
                {monsterLabel}
              </p>
              {result ? (
                <span className="text-muted-foreground text-xs">
                  {RESULT_LABEL_MAP[result] ?? result}
                </span>
              ) : null}
            </div>
            {monsterStats.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {monsterStats.map((stat) => (
                  <span
                    key={stat.label}
                    className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[11px] font-medium"
                  >
                    {stat.label} {stat.value}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatStatValue(
  value?: number,
  bonus?: number
): { base?: string; bonus?: string; bonusTone?: "gain" | "loss" } {
  if (typeof value !== "number") {
    return { base: undefined, bonus: undefined, bonusTone: undefined };
  }

  if (typeof bonus === "number" && bonus !== 0) {
    const sign = bonus > 0 ? "+" : "";
    return {
      base: String(value),
      bonus: `${sign}${bonus}`,
      bonusTone: bonus > 0 ? "gain" : "loss",
    };
  }

  return { base: String(value), bonus: undefined, bonusTone: undefined };
}

function resolveInitials(name?: string) {
  const label = name ?? "?";
  return label
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
