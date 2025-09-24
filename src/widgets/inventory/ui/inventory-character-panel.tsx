import type { InventorySummary } from "@/entities/inventory/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { StatItem } from "@/entities/inventory/ui/stat-item";

interface InventoryCharacterPanelProps {
  summary: InventorySummary;
}

export function InventoryCharacterPanel({
  summary,
}: InventoryCharacterPanelProps) {
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

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <StatItem title="HP" value={summary.hp.toString()} caption="체력" />
          <StatItem
            title="ATK"
            value={summary.atk.toString()}
            caption="공격력"
          />
          <StatItem
            title="DEF"
            value={summary.def.toString()}
            caption="방어력"
          />
          <StatItem
            title="LUCK"
            value={summary.luck.toString()}
            caption="행운"
          />
        </dl>
      </CardContent>
    </Card>
  );
}
