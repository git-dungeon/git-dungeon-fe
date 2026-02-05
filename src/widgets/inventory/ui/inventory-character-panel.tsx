import { MISSING_SPRITE } from "@/entities/catalog/config/local-sprites";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { PixelAvatar } from "@/shared/ui/pixel-avatar";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelStatRow } from "@/shared/ui/pixel-stat-row";
import { StatValueWithBonus } from "@/shared/ui/stat-value-with-bonus";
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

  const rows = [
    {
      key: "level",
      label: t("dashboard.summaryRows.level"),
      value: t("dashboard.summaryRows.levelValue", { level }),
    },
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
  ];

  return (
    <PixelPanel title={t("dashboard.panels.summary")} className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <PixelAvatar
          src={avatarUrl ?? MISSING_SPRITE}
          alt={t("dashboard.summaryRows.avatar")}
          className="w-fit"
          imageClassName="h-16 w-16 object-contain"
        />
        <div className="flex-1 space-y-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="border-b border-white/5 pb-2 last:border-none last:pb-0"
            >
              <PixelStatRow label={row.label} value={row.value} />
            </div>
          ))}
        </div>
      </div>
    </PixelPanel>
  );
}
