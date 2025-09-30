import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { StatItem } from "@/entities/inventory/ui/stat-item";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { formatNumber } from "@/entities/dashboard/lib/formatters";

interface InventoryCharacterPanelProps {
  stats: CharacterStatSummary;
}

export function InventoryCharacterPanel({
  stats,
}: InventoryCharacterPanelProps) {
  const { total, equipmentBonus } = stats;

  return (
    <Card>
      <CardHeader>
        <CardTitle>캐릭터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex size-36 items-center justify-center rounded-md border-2">
            <div className="size-24 rounded-sm bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-[0_8px_16px_rgba(249,115,22,0.35)]" />
            <div
              className="absolute -bottom-3 h-3 w-20 rounded-full"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 text-sm">현재 능력치</p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <StatItem
            title="HP"
            caption={`최대 HP ${formatNumber(total.maxHp)}`}
            total={total.hp}
            equipmentBonus={equipmentBonus.hp}
          />
          <StatItem
            title="ATK"
            caption="공격력"
            total={total.atk}
            equipmentBonus={equipmentBonus.atk}
          />
          <StatItem
            title="DEF"
            caption="방어력"
            total={total.def}
            equipmentBonus={equipmentBonus.def}
          />
          <StatItem
            title="LUCK"
            caption="행운"
            total={total.luck}
            equipmentBonus={equipmentBonus.luck}
          />
        </div>
      </CardContent>
    </Card>
  );
}
