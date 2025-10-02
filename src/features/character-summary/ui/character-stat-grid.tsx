import { StatItem } from "@/entities/inventory/ui/stat-item";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { formatNumber } from "@/entities/dashboard/lib/formatters";

interface CharacterStatGridProps {
  stats: CharacterStatSummary;
  className?: string;
}

export function CharacterStatGrid({
  stats,
  className,
}: CharacterStatGridProps) {
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
  ];

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <StatItem
            key={entry.key}
            title={entry.title}
            caption={entry.caption}
            total={entry.total}
            equipmentBonus={entry.bonus}
          />
        ))}
      </div>
    </div>
  );
}
