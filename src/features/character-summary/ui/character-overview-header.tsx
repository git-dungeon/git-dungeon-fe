import { SummaryTile } from "@/shared/ui/summary-tile";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { Progress } from "@/shared/ui/progress";

interface CharacterOverviewHeaderProps {
  level: number;
  exp: number;
  expToLevel: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  gold: number;
  ap: number;
}

export function CharacterOverviewHeader({
  level,
  exp,
  expToLevel,
  floor,
  gold,
  ap,
}: CharacterOverviewHeaderProps) {
  const expPercent = resolvePercent(exp, expToLevel);
  const floorPercent = resolvePercent(floor.progress, 100);

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <SummaryTile title="레벨" value={`Lv. ${level}`}>
        <p className="text-muted-foreground text-xs">
          {formatNumber(exp)} / {formatNumber(expToLevel)}
        </p>
        <Progress value={expPercent} aria-label="경험치 진행률" />
      </SummaryTile>
      <SummaryTile title="층 진행" value={`${floor.current}F / ${floor.best}F`}>
        <p className="text-muted-foreground text-xs">진행도 {floorPercent}%</p>
        <Progress value={floorPercent} aria-label="층 진행도" />
      </SummaryTile>
      <SummaryTile title="골드" value={`${formatNumber(gold)} G`}>
        <p className="text-muted-foreground text-xs">총 보유 골드</p>
      </SummaryTile>
      <SummaryTile title="AP" value={`${formatNumber(ap)}`}>
        <p className="text-muted-foreground text-xs">행동력</p>
      </SummaryTile>
    </div>
  );
}

function resolvePercent(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}
