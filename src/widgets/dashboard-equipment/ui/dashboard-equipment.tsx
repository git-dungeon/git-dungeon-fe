import type { EquippedItem } from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EquipmentRow } from "@/widgets/dashboard-equipment/ui/equipment-row";

interface DashboardEquipmentProps {
  weapon?: EquippedItem;
  armor?: EquippedItem;
}

export function DashboardEquipment({ weapon, armor }: DashboardEquipmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">착용 중인 장비</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-border divide-y text-sm">
          <EquipmentRow
            label="무기"
            item={weapon}
            placeholder="장착된 무기가 없습니다."
            formatItem={formatEquipment}
            formatModifier={formatModifier}
          />
          <EquipmentRow
            label="방어구"
            item={armor}
            placeholder="장착된 방어구가 없습니다."
            formatItem={formatEquipment}
            formatModifier={formatModifier}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

function formatEquipment(item: EquippedItem): string {
  return `${item.name} · ${formatRarity(item.rarity)}`;
}
