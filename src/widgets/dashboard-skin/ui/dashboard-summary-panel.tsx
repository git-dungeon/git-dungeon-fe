import fallbackAvatar from "@/assets/helmet/knights-helm.png";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { DashboardStatBar } from "@/widgets/dashboard-skin/ui/dashboard-stat-bar";
import { useTranslation } from "react-i18next";

const goldImage = "/coin.webp";

interface DashboardSummaryPanelProps {
  level: number;
  hp: number;
  maxHp: number;
  ap: number;
  exp: number;
  expToLevel: number;
  gold: number;
  equipment: InventoryItem[];
}

export function DashboardSummaryPanel({
  level,
  hp,
  maxHp,
  ap,
  exp,
  expToLevel,
  gold,
  equipment,
}: DashboardSummaryPanelProps) {
  const { t } = useTranslation();
  const hpPercent = resolvePercent(hp, maxHp);
  const expPercent = resolvePercent(exp, expToLevel);
  const avatarSrc = resolveAvatarSprite(equipment) ?? fallbackAvatar;

  return (
    <PixelPanel
      title={t("dashboard.panels.summary")}
      className="h-full"
      contentClassName="gap-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="pixel-avatar w-fit">
          <img
            src={avatarSrc}
            alt={t("dashboard.summaryRows.avatar")}
            className="h-16 w-16 object-contain"
          />
        </div>
        <div className="flex-1 space-y-3">
          <StatRow
            label={t("dashboard.summaryRows.level")}
            value={t("dashboard.summaryRows.levelValue", { level })}
          />
          <DashboardStatBar
            label={t("dashboard.summaryRows.hp")}
            value={`${formatNumber(hp)} / ${formatNumber(maxHp)}`}
            percent={hpPercent}
            tone="hp"
            valueInBar
          />
          <DashboardStatBar
            label={t("dashboard.summaryRows.exp")}
            value={`${formatNumber(exp)} / ${formatNumber(expToLevel)}`}
            percent={expPercent}
            tone="exp"
            valueInBar
          />
          <StatRow
            label={t("dashboard.summaryRows.ap")}
            value={`${formatNumber(ap)}`}
          />
          <StatRow
            label={t("dashboard.summaryRows.gold")}
            value={`${formatNumber(gold)}`}
            iconSrc={goldImage}
            iconAlt={t("dashboard.summaryRows.gold")}
          />
        </div>
      </div>
    </PixelPanel>
  );
}

function resolvePercent(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

function resolveAvatarSprite(items: InventoryItem[]): string | null {
  const preferred = ["helmet", "armor", "weapon", "ring"] as const;
  const candidate = preferred
    .map((slot) => items.find((item) => item.slot === slot))
    .find(Boolean);
  if (!candidate) {
    return null;
  }

  return resolveLocalItemSprite(candidate.code) ?? null;
}

interface StatRowProps {
  label: string;
  value: string;
  iconSrc?: string;
  iconAlt?: string;
}

function StatRow({ label, value, iconSrc, iconAlt }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {iconSrc ? (
          <img src={iconSrc} alt={iconAlt ?? label} className="h-4 w-4" />
        ) : null}
        <span className="pixel-stat-label">{label}</span>
      </div>
      <span className="pixel-stat-value">{value}</span>
    </div>
  );
}
