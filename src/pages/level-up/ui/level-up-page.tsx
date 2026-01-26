import { useTranslation } from "react-i18next";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { PixelButton } from "@/shared/ui/pixel-button";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { useDashboardState } from "@/entities/dashboard/model/use-dashboard-state";
import { useLevelUpSelection } from "@/entities/level-up/model/use-level-up-selection";
import { useLevelUpApply } from "@/entities/level-up/model/use-level-up-apply";
import type { LevelUpOption } from "@/entities/level-up/model/types";
import { LevelUpOptionGrid } from "@/widgets/level-up/ui/level-up-option-grid";

export function LevelUpPage() {
  const { t } = useTranslation();
  const dashboardQuery = useDashboardState();
  const initialPoints = dashboardQuery.data?.levelUpPoints ?? undefined;
  const selectionQuery = useLevelUpSelection({
    enabled: initialPoints !== undefined ? initialPoints > 0 : true,
  });
  const applyMutation = useLevelUpApply();

  const shouldIgnoreSelection = initialPoints === 0;
  const selection = shouldIgnoreSelection
    ? null
    : (selectionQuery.data ?? null);
  const points = shouldIgnoreSelection
    ? 0
    : (selection?.points ?? initialPoints ?? 0);
  const rollIndex = selection?.rollIndex ?? 0;
  const options = selection?.options ?? [];
  const isSelecting = applyMutation.isPending;
  const isLoading =
    !shouldIgnoreSelection &&
    (selectionQuery.isLoading || (selectionQuery.isFetching && !selection));
  const hasPoints = points > 0;

  const handleSelect = (option: LevelUpOption) => {
    if (isSelecting) {
      return;
    }

    applyMutation.mutate({ stat: option.stat, rollIndex }, {});
  };

  return (
    <section className="level-up-page space-y-6">
      <header className="level-up-page-header">
        <div className="space-y-1">
          <h1 className="font-pixel-title pixel-page-title">
            {t("levelUp.page.title")}
          </h1>
          <p className="level-up-page-subtitle">{t("levelUp.page.subtitle")}</p>
        </div>
        <div className="level-up-page-points">
          <span className="level-up-page-points-label">
            {t("levelUp.page.pointsLabel")}
          </span>
          <PixelPill icon="count">
            {t("levelUp.page.points", { points })}
          </PixelPill>
        </div>
      </header>

      {selectionQuery.isError ? (
        <PixelErrorState
          message={t("levelUp.page.loadError")}
          actions={
            <PixelButton
              type="button"
              pixelSize="compact"
              onClick={() => void selectionQuery.refetch()}
            >
              {t("levelUp.page.retry")}
            </PixelButton>
          }
        />
      ) : null}

      {isLoading ? (
        <PixelSkeletonState
          titleWidth="w-1/2"
          lineWidths={["w-full"]}
          count={3}
        />
      ) : null}

      {!isLoading && !selectionQuery.isError && !hasPoints ? (
        <PixelEmptyState
          message={
            <div className="space-y-1">
              <div className="font-semibold">
                {t("levelUp.page.emptyTitle")}
              </div>
              <div>{t("levelUp.page.emptyDescription")}</div>
            </div>
          }
        />
      ) : null}

      {!isLoading && hasPoints && options.length > 0 ? (
        <>
          <LevelUpOptionGrid
            options={options}
            onSelect={handleSelect}
            isPending={isSelecting}
            rollIndex={rollIndex}
          />
        </>
      ) : null}
    </section>
  );
}
