import { cn } from "@/shared/lib/utils";
import type { InventoryItem } from "@/entities/inventory/model/types";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { CharacterOverviewHeader } from "@/features/character-summary/ui/character-overview-header";
import { CharacterStatGrid } from "@/features/character-summary/ui/character-stat-grid";
import { EquipmentSlotGrid } from "@/entities/inventory/ui/equipment-slot-grid";

interface DashboardEmbeddingBannerProps {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  ap: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  stats: CharacterStatSummary;
  equipment: InventoryItem[];
  layoutClassName?: string;
}

export function DashboardEmbeddingBanner({
  level,
  exp,
  expToLevel,
  gold,
  ap,
  floor,
  stats,
  equipment,
  layoutClassName,
}: DashboardEmbeddingBannerProps) {
  return (
    <section
      className={cn(
        "from-background to-muted/40 border-border space-y-6 rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
        layoutClassName
      )}
      aria-label="캐릭터 임베딩 정보"
    >
      <CharacterOverviewHeader
        level={level}
        exp={exp}
        expToLevel={expToLevel}
        floor={floor}
        gold={gold}
        ap={ap}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <CharacterStatGrid stats={stats} />
        <div className="space-y-3">
          <h3 className="text-foreground text-sm font-semibold">착용 장비</h3>
          <EquipmentSlotGrid equipped={equipment} />
        </div>
      </section>
    </section>
  );
}
