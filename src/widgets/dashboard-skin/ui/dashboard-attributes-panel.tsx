import { formatNumber } from "@/entities/dashboard/lib/formatters";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { PixelPanel } from "@/shared/ui/pixel-panel";
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
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between border-b border-white/5 pb-2 text-sm last:border-none last:pb-0"
          >
            <span className="pixel-stat-label">{row.label}</span>
            <span className="pixel-stat-value">{row.value}</span>
          </div>
        ))}
      </div>
    </PixelPanel>
  );
}
