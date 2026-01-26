import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { cn } from "@/shared/lib/utils";

interface LevelUpBannerProps {
  points: number;
  className?: string;
}

export function LevelUpBanner({ points, className }: LevelUpBannerProps) {
  const { t } = useTranslation();

  if (points <= 0) {
    return null;
  }

  return (
    <section className={cn("level-up-banner", className)}>
      <Link to="/level-up" className="level-up-banner-inner">
        <div className="level-up-banner-content">
          <span className="level-up-banner-title font-pixel-title">
            {t("levelUp.banner.title")}
          </span>
          <span className="level-up-banner-message">
            {t("levelUp.banner.message", { points })}
          </span>
        </div>
        <div className="level-up-banner-actions">
          <PixelPill icon="plus" className="level-up-banner-pill">
            {t("levelUp.banner.points", { points })}
          </PixelPill>
          <span className="level-up-banner-cta">{t("levelUp.banner.cta")}</span>
        </div>
      </Link>
    </section>
  );
}
