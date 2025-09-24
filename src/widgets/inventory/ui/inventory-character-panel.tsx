import type { InventorySummary } from "@/entities/inventory/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatNumber } from "@/entities/dashboard/lib/formatters";

interface InventoryCharacterPanelProps {
  summary: InventorySummary;
}

export function InventoryCharacterPanel({
  summary,
}: InventoryCharacterPanelProps) {
  return (
    <Card className="bg-neutral-900/60 text-neutral-100 shadow-[0_0_0_2px_rgba(255,255,255,0.05)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">캐릭터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex size-36 items-center justify-center rounded-md border-2 border-neutral-700 bg-neutral-800">
            <div className="size-24 rounded-sm bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-[0_8px_16px_rgba(249,115,22,0.35)]" />
            <div
              className="absolute -bottom-3 h-3 w-20 rounded-full bg-black/40 blur"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 text-sm text-neutral-300">현재 장비 적용 능력치</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <StatItem label="HP" value={summary.hp} />
          <StatItem label="ATK" value={summary.atk} />
          <StatItem label="DEF" value={summary.def} />
          <StatItem label="LUCK" value={summary.luck} />
        </dl>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-2">
      <dt className="text-xs tracking-wide text-neutral-400 uppercase">
        {label}
      </dt>
      <dd className="text-lg font-semibold text-neutral-100">
        {formatNumber(value)}
      </dd>
    </div>
  );
}
