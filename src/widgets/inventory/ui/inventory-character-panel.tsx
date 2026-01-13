import { MISSING_SPRITE } from "@/entities/catalog/config/local-sprites";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { DashboardStatRow } from "@/widgets/dashboard-skin/ui/dashboard-stat-row";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { useTranslation } from "react-i18next";

interface InventoryCharacterPanelProps {
  stats: CharacterStatSummary;
  level: number;
  avatarUrl?: string | null;
}

export function InventoryCharacterPanel({
  stats,
  level,
  avatarUrl,
}: InventoryCharacterPanelProps) {
  const { t } = useTranslation();

  const formatBonus = (value: number) => {
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
  };

  const rows = [
    {
      key: "level",
      label: t("dashboard.summaryRows.level"),
      value: t("dashboard.summaryRows.levelValue", { level }),
    },
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
  ];

  return (
    <PixelPanel title={t("dashboard.panels.summary")} className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="pixel-avatar w-fit">
          <img
            src={avatarUrl ?? MISSING_SPRITE}
            alt={t("dashboard.summaryRows.avatar")}
            className="h-16 w-16 object-contain"
          />
        </div>
        <div className="flex-1 space-y-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="border-b border-white/5 pb-2 last:border-none last:pb-0"
            >
              <DashboardStatRow label={row.label} value={row.value} />
            </div>
          ))}
        </div>
      </div>
    </PixelPanel>
  );
}
