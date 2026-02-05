import { formatNumber } from "@/entities/dashboard/lib/formatters";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { StatValueWithBonus } from "@/shared/ui/stat-value-with-bonus";
import { DashboardStatRow } from "@/widgets/dashboard-skin/ui/dashboard-stat-row";
import { useTranslation } from "react-i18next";

interface DashboardAttributesPanelProps {
  stats: CharacterStatSummary;
  ap: number;
}

export function DashboardAttributesPanel({
  stats,
  ap,
}: DashboardAttributesPanelProps) {
  const { t } = useTranslation();

  const rows = [
    {
      key: "hp",
      label: t("dashboard.attributes.hp"),
      value: (
        <StatValueWithBonus
          bonus={stats.equipmentBonus.maxHp}
          format={formatNumber}
        >
          <>
            {formatNumber(stats.total.hp)} / {formatNumber(stats.total.maxHp)}
          </>
        </StatValueWithBonus>
      ),
    },
    {
      key: "atk",
      label: t("dashboard.attributes.atk"),
      value: (
        <StatValueWithBonus
          bonus={stats.equipmentBonus.atk}
          format={formatNumber}
        >
          {formatNumber(stats.total.atk)}
        </StatValueWithBonus>
      ),
    },
    {
      key: "def",
      label: t("dashboard.attributes.def"),
      value: (
        <StatValueWithBonus
          bonus={stats.equipmentBonus.def}
          format={formatNumber}
        >
          {formatNumber(stats.total.def)}
        </StatValueWithBonus>
      ),
    },
    {
      key: "luck",
      label: t("dashboard.attributes.luck"),
      value: (
        <StatValueWithBonus
          bonus={stats.equipmentBonus.luck}
          format={formatNumber}
        >
          {formatNumber(stats.total.luck)}
        </StatValueWithBonus>
      ),
    },
    {
      key: "ap",
      label: t("dashboard.attributes.ap"),
      value: formatNumber(ap),
    },
  ];

  return (
    <PixelPanel title={t("dashboard.panels.attributes")} className="h-full">
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.key}
            className="border-b border-white/5 pb-2 last:border-none last:pb-0"
          >
            <DashboardStatRow label={row.label} value={row.value} />
          </li>
        ))}
      </ul>
    </PixelPanel>
  );
}
