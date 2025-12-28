import type {
  EquipmentSlot,
  EquipmentItem,
} from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EquipmentRow } from "@/widgets/dashboard-equipment/ui/equipment-row";
import { useTranslation } from "react-i18next";

interface DashboardEquipmentProps {
  helmet?: EquipmentItem;
  armor?: EquipmentItem;
  weapon?: EquipmentItem;
  ring?: EquipmentItem;
}

export function DashboardEquipment({
  helmet,
  armor,
  weapon,
  ring,
}: DashboardEquipmentProps) {
  const { t } = useTranslation();
  const equipmentRows: Array<{
    slot: EquipmentSlot;
    label: string;
    placeholder: string;
  }> = [
    {
      slot: "helmet",
      label: t("dashboard.equipment.slots.helmet"),
      placeholder: t("dashboard.equipment.placeholders.helmet"),
    },
    {
      slot: "armor",
      label: t("dashboard.equipment.slots.armor"),
      placeholder: t("dashboard.equipment.placeholders.armor"),
    },
    {
      slot: "weapon",
      label: t("dashboard.equipment.slots.weapon"),
      placeholder: t("dashboard.equipment.placeholders.weapon"),
    },
    {
      slot: "ring",
      label: t("dashboard.equipment.slots.ring"),
      placeholder: t("dashboard.equipment.placeholders.ring"),
    },
  ];
  const itemsBySlot: Partial<Record<EquipmentSlot, EquipmentItem | undefined>> =
    {
      helmet,
      armor,
      weapon,
      ring,
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("dashboard.equipment.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-border divide-y text-sm">
          {equipmentRows.map(({ slot, label, placeholder }) => (
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

function formatEquipment(item: EquipmentItem): string {
  const name = item.name ?? item.code;
  return `${name} · ${formatRarity(item.rarity)}`;
}
