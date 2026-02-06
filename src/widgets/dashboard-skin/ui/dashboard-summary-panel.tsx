import {
  MISSING_SPRITE,
  resolveLocalItemSprite,
} from "@/entities/catalog/config/local-sprites";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { formatNumber } from "@/shared/lib/format/number";
import { calcRoundedPercent } from "@/entities/dashboard/lib/progress";
import { PixelAvatar } from "@/shared/ui/pixel-avatar";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelStatRow } from "@/shared/ui/pixel-stat-row";
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
  avatarUrl?: string | null;
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
  avatarUrl,
}: DashboardSummaryPanelProps) {
  const { t } = useTranslation();
  const hpPercent = calcRoundedPercent(hp, maxHp);
  const expPercent = calcRoundedPercent(exp, expToLevel);
  const profileAvatar = avatarUrl?.trim() ? avatarUrl : null;
  const equipmentAvatar = resolveAvatarSprite(equipment);
  const avatarSrc = profileAvatar ?? equipmentAvatar ?? MISSING_SPRITE;

  return (
    <PixelPanel
      title={t("dashboard.panels.summary")}
      className="h-full"
      contentClassName="gap-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <PixelAvatar
          src={avatarSrc}
          alt={t("dashboard.summaryRows.avatar")}
          className="w-fit"
          imageClassName="h-16 w-16 object-contain"
        />
        <div className="flex-1 space-y-3">
          <PixelStatRow
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
          <PixelStatRow
            label={t("dashboard.summaryRows.ap")}
            value={`${formatNumber(ap)}`}
          />
          <PixelStatRow
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
