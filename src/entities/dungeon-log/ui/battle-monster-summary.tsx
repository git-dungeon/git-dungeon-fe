import type { DungeonLogMonster } from "@/entities/dungeon-log/model/types";
import { resolveMonsterThumbnail } from "@/entities/dungeon-log/config/thumbnails";
import { cn } from "@/shared/lib/utils";

type BattleResult = "VICTORY" | "DEFEAT";

interface BattleMonsterSummaryProps {
  monster?: DungeonLogMonster;
  result?: BattleResult;
  size?: "compact" | "detail";
}

const RESULT_LABEL_MAP: Record<BattleResult, string> = {
  VICTORY: "승리",
  DEFEAT: "패배",
};

export function BattleMonsterSummary({
  monster,
  result,
  size = "compact",
}: BattleMonsterSummaryProps) {
  if (!monster) {
    return null;
  }

  const image = resolveMonsterThumbnail(monster.spriteId, monster.code);
  const stats = [
    { label: "HP", value: monster.hp },
    { label: "ATK", value: monster.atk },
    { label: "DEF", value: monster.def },
  ].filter((stat) => typeof stat.value === "number");

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        size === "detail" ? "items-start" : undefined
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
            alt={monster.name ?? "몬스터"}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-foreground text-sm font-semibold">
            {monster.name ?? "몬스터"}
          </p>
          {result ? (
            <span className="text-muted-foreground text-xs">
              {RESULT_LABEL_MAP[result] ?? result}
            </span>
          ) : null}
        </div>
        {stats.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {stats.map((stat) => (
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
  );
}
