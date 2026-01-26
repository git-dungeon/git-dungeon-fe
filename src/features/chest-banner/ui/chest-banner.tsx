import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { cn } from "@/shared/lib/utils";
import chestIcon from "@/assets/event/chest.png";

interface ChestBannerProps {
  count: number;
  className?: string;
}

export function ChestBanner({ count, className }: ChestBannerProps) {
  const { t } = useTranslation();

  if (count <= 0) {
    return null;
  }

  return (
    <section className={cn("chest-banner", className)}>
      <Link to="/chest" className="chest-banner-inner">
        <div className="chest-banner-content">
          <div className="chest-banner-title-row">
            <img
              className="chest-banner-icon"
              src={chestIcon}
              alt={t("chest.banner.iconAlt")}
            />
            <span className="chest-banner-title font-pixel-title">
              {t("chest.banner.title")}
            </span>
          </div>
          <span className="chest-banner-message">
            {t("chest.banner.message", { count })}
          </span>
        </div>
        <div className="chest-banner-actions">
          <PixelPill icon="plus" className="chest-banner-pill">
            {t("chest.banner.count", { count })}
          </PixelPill>
          <span className="chest-banner-cta">{t("chest.banner.cta")}</span>
        </div>
      </Link>
    </section>
  );
}
