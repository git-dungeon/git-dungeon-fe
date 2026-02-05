import { formatNumber } from "@/entities/dashboard/lib/formatters";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { DashboardStatRow } from "@/widgets/dashboard-skin/ui/dashboard-stat-row";
import { useTranslation } from "react-i18next";

interface DashboardAttributesPanelProps {
  stats: CharacterStatSummary;
  ap: number;
}

function formatBonus(value: number) {
  if (!value) {
    return null;
  }

  const sign = value > 0 ? "+" : "";
  const toneClass =
    value > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  return (
    <span className={toneClass}>
      ({sign}
      {formatNumber(value)})
    </span>
  );
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
      value: (() => {
        const bonus = formatBonus(stats.equipmentBonus.maxHp);
        return (
          <>
            {formatNumber(stats.total.hp)} / {formatNumber(stats.total.maxHp)}
            {bonus ? <span className="ml-1">{bonus}</span> : null}
          </>
        );
      })(),
    },
    {
      key: "atk",
      label: t("dashboard.attributes.atk"),
      value: (() => {
        const bonus = formatBonus(stats.equipmentBonus.atk);
        return (
          <>
            {formatNumber(stats.total.atk)}
            {bonus ? <span className="ml-1">{bonus}</span> : null}
          </>
        );
      })(),
    },
    {
      key: "def",
      label: t("dashboard.attributes.def"),
      value: (() => {
        const bonus = formatBonus(stats.equipmentBonus.def);
        return (
          <>
            {formatNumber(stats.total.def)}
            {bonus ? <span className="ml-1">{bonus}</span> : null}
          </>
        );
      })(),
    },
    {
      key: "luck",
      label: t("dashboard.attributes.luck"),
      value: (() => {
        const bonus = formatBonus(stats.equipmentBonus.luck);
        return (
          <>
            {formatNumber(stats.total.luck)}
            {bonus ? <span className="ml-1">{bonus}</span> : null}
          </>
        );
      })(),
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
