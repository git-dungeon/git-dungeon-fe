import type {
  EquippedItem,
  EquipmentSlot,
} from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EquipmentRow } from "@/widgets/dashboard-equipment/ui/equipment-row";

interface DashboardEquipmentProps {
  helmet?: EquippedItem;
  armor?: EquippedItem;
  weapon?: EquippedItem;
  ring?: EquippedItem;
}

const EQUIPMENT_ROWS: Array<{
  slot: EquipmentSlot;
  label: string;
  placeholder: string;
}> = [
  {
    slot: "helmet",
    label: "투구",
    placeholder: "장착된 투구가 없습니다.",
  },
  {
    slot: "armor",
    label: "방어구",
    placeholder: "장착된 방어구가 없습니다.",
  },
  {
    slot: "weapon",
    label: "무기",
    placeholder: "장착된 무기가 없습니다.",
  },
  {
    slot: "ring",
    label: "반지",
    placeholder: "장착된 반지가 없습니다.",
  },
];

export function DashboardEquipment({
  helmet,
  armor,
  weapon,
  ring,
}: DashboardEquipmentProps) {
  const itemsBySlot: Partial<Record<EquipmentSlot, EquippedItem | undefined>> =
    {
      helmet,
      armor,
      weapon,
      ring,
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">착용 중인 장비</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-border divide-y text-sm">
          {EQUIPMENT_ROWS.map(({ slot, label, placeholder }) => (
            <EquipmentRow
              key={slot}
              label={label}
              item={itemsBySlot[slot]}
              placeholder={placeholder}
              formatItem={formatEquipment}
              formatModifier={formatModifier}
            />
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function formatEquipment(item: EquippedItem): string {
  return `${item.name} · ${formatRarity(item.rarity)}`;
}
