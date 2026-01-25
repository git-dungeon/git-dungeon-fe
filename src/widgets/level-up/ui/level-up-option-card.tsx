import { useTranslation } from "react-i18next";
import type {
  LevelUpOption,
  LevelUpStat,
} from "@/entities/level-up/model/types";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import type { EquipmentRarity } from "@/entities/dashboard/model/types";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { PixelButton } from "@/shared/ui/pixel-button";
import { cn } from "@/shared/lib/utils";
import atkIcon from "@/assets/stat/atk.png";
import defIcon from "@/assets/stat/def.png";
import hpIcon from "@/assets/stat/hp.png";
import luckIcon from "@/assets/stat/luck.png";

const STAT_ICONS: Record<LevelUpStat, string> = {
  hp: hpIcon,
  atk: atkIcon,
  def: defIcon,
  luck: luckIcon,
};

interface LevelUpOptionCardProps {
  option: LevelUpOption;
  onSelect: (option: LevelUpOption) => void;
  isPending?: boolean;
}

export function LevelUpOptionCard({
  option,
  onSelect,
  isPending = false,
}: LevelUpOptionCardProps) {
  const { t } = useTranslation();
  const statLabel = t(`dashboard.attributes.${option.stat}`);
  const rarityLabel = formatRarity(option.rarity as EquipmentRarity);
  const valueLabel = t("levelUp.page.optionValue", {
    stat: statLabel,
    value: option.value,
  });
  const rarityClass = `rarity-${option.rarity}`;

  return (
    <div
      className={cn(
        "level-up-option-card",
        rarityClass,
        isPending && "level-up-option-card--disabled"
      )}
    >
      <div className="level-up-option-card-header">
        <span className="level-up-option-stat">{statLabel}</span>
        <PixelPill
          tone="rarity"
          rarity={option.rarity as EquipmentRarity}
          className="level-up-option-pill"
        >
          {rarityLabel}
        </PixelPill>
      </div>
      <div className="level-up-option-icon">
        <img src={STAT_ICONS[option.stat]} alt={statLabel} loading="lazy" />
      </div>
      <div className="level-up-option-value">{valueLabel}</div>
      <PixelButton
        type="button"
        onClick={() => onSelect(option)}
        disabled={isPending}
        className="level-up-option-action"
      >
        {isPending ? t("levelUp.page.pending") : t("levelUp.page.select")}
      </PixelButton>
    </div>
  );
}
