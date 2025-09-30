import { useMemo, type ReactNode } from "react";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { StatItem } from "@/entities/inventory/ui/stat-item";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { cn } from "@/shared/lib/utils";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { EmptySlot } from "@/widgets/inventory/ui/inventory-slots";
import {
  EQUIPMENT_SLOTS,
  type EquipmentSlot,
} from "@/entities/dashboard/model/types";

interface DashboardEmbeddingBannerProps {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  stats: CharacterStatSummary;
  equipment: InventoryItem[];
  layoutClassName?: string;
}

const SUMMARY_TILE_CLASSNAME =
  "border-border bg-card flex flex-col gap-1 rounded-lg border p-4 shadow-sm";

export function DashboardEmbeddingBanner({
  level,
  exp,
  expToLevel,
  gold,
  floor,
  stats,
  equipment,
  layoutClassName,
}: DashboardEmbeddingBannerProps) {
  const expPercent = useMemo(() => {
    if (expToLevel <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((exp / expToLevel) * 100));
  }, [exp, expToLevel]);

  const floorPercent = useMemo(() => {
    return Math.min(100, Math.max(0, Math.round(floor.progress)));
  }, [floor.progress]);

  const equipmentMap = useMemo(() => buildEquipmentMap(equipment), [equipment]);

  return (
    <section
      className={cn(
        "from-background to-muted/40 border-border space-y-6 rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
        layoutClassName
      )}
      aria-label="캐릭터 임베딩 정보"
    >
      <header className="grid gap-4 lg:grid-cols-4">
        <SummaryTile title="레벨" value={`Lv. ${level}`}>
          <p className="text-muted-foreground text-xs">
            다음 레벨까지 {formatNumber(Math.max(expToLevel - exp, 0))} EXP
          </p>
        </SummaryTile>
        <SummaryTile
          title="층 진행"
          value={`${floor.current}F / ${floor.best}F`}
        >
          <p className="text-muted-foreground text-xs">
            진행도 {floorPercent}%
          </p>
          <ProgressBar value={floorPercent} />
        </SummaryTile>
        <SummaryTile title="골드" value={`${formatNumber(gold)} G`}>
          <p className="text-muted-foreground text-xs">총 보유 골드</p>
        </SummaryTile>
        <SummaryTile
          title="경험치"
          value={`${formatNumber(exp)} / ${formatNumber(expToLevel)}`}
        >
          <p className="text-muted-foreground text-xs">진행률 {expPercent}%</p>
          <ProgressBar value={expPercent} />
        </SummaryTile>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {renderStatItems(stats)}
        </div>
        <aside className="space-y-3">
          <h3 className="text-foreground text-sm font-semibold">착용 장비</h3>
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_SLOTS.map((slot) => {
              const item = equipmentMap[slot];
              return (
                <div
                  key={slot}
                  className="border-border bg-background flex h-auto w-full flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center"
                >
                  {item ? (
                    <InventoryItemCard
                      item={item}
                      className="items-center"
                      showSlotLabel
                    />
                  ) : (
                    <EmptySlot slot={slot} />
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </section>
  );
}

interface SummaryTileProps {
  title: string;
  value: string;
  children?: ReactNode;
}

function SummaryTile({ title, value, children }: SummaryTileProps) {
  return (
    <div className={SUMMARY_TILE_CLASSNAME}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      <p className="text-foreground text-xl font-semibold">{value}</p>
      {children}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
}

function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
      <div
        className="bg-primary absolute top-0 left-0 h-full"
        style={{ width: `${value}%` }}
        aria-hidden
      />
      <span className="sr-only">{value}%</span>
    </div>
  );
}

function renderStatItems(stats: CharacterStatSummary) {
  const entries = [
    {
      key: "hp",
      title: "HP",
      caption: `최대 HP ${formatNumber(stats.total.maxHp)}`,
      total: stats.total.hp,
      bonus: stats.equipmentBonus.hp,
    },
    {
      key: "atk",
      title: "ATK",
      caption: "공격력",
      total: stats.total.atk,
      bonus: stats.equipmentBonus.atk,
    },
    {
      key: "def",
      title: "DEF",
      caption: "방어력",
      total: stats.total.def,
      bonus: stats.equipmentBonus.def,
    },
    {
      key: "luck",
      title: "LUCK",
      caption: "행운",
      total: stats.total.luck,
      bonus: stats.equipmentBonus.luck,
    },
    {
      key: "ap",
      title: "AP",
      caption: "행동력",
      total: stats.total.ap,
      bonus: stats.equipmentBonus.ap,
    },
  ];

  return entries.map((entry) => (
    <StatItem
      key={entry.key}
      title={entry.title}
      caption={entry.caption}
      total={entry.total}
      equipmentBonus={entry.bonus}
    />
  ));
}

function buildEquipmentMap(items: InventoryItem[]) {
  return EQUIPMENT_SLOTS.reduce<Record<EquipmentSlot, InventoryItem | null>>(
    (acc, slot) => {
      acc[slot] = items.find((item) => item.slot === slot) ?? null;
      return acc;
    },
    {
      helmet: null,
      armor: null,
      weapon: null,
      ring: null,
    }
  );
}
