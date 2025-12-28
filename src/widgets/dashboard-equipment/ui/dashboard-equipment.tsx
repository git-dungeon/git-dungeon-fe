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
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";

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
  const resolveItemName = useCatalogItemNameResolver();
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
              formatItem={(item) => formatEquipment(resolveItemName, item)}
              formatModifier={formatModifier}
            />
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function formatEquipment(
  resolveItemName: (code: string, fallback?: string | null) => string,
  item: EquipmentItem
): string {
  const name = resolveItemName(item.code, item.name);
  return `${name} · ${formatRarity(item.rarity)}`;
}
