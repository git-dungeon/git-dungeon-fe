import { formatNumber } from "@/entities/dashboard/lib/formatters";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { PixelPanel } from "@/shared/ui/pixel-panel";
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
      value: `${formatNumber(stats.total.hp)} / ${formatNumber(stats.total.maxHp)}`,
    },
    {
      key: "atk",
      label: t("dashboard.attributes.atk"),
      value: formatNumber(stats.total.atk),
    },
    {
      key: "def",
      label: t("dashboard.attributes.def"),
      value: formatNumber(stats.total.def),
    },
    {
      key: "luck",
      label: t("dashboard.attributes.luck"),
      value: formatNumber(stats.total.luck),
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
