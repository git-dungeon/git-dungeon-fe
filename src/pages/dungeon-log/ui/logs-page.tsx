import { useState } from "react";
import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";
import { useTranslation } from "react-i18next";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import {
  DungeonLogFiltersPanel,
  type DateRangeState,
  type LogsFilterSelection,
  ALL_FILTER_VALUE,
} from "@/widgets/dungeon-log-filters/ui/dungeon-log-filters-panel";

function buildRangeBoundary(value: string, boundary: "start" | "end") {
  if (!value) {
    return undefined;
  }
  const suffix = boundary === "start" ? "T00:00:00.000" : "T23:59:59.999";
  const parsed = new Date(`${value}${suffix}`);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed.toISOString();
}

export function LogsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LogsFilterSelection>(ALL_FILTER_VALUE);
  const [dateRange, setDateRange] = useState<DateRangeState>({
    start: "",
    end: "",
  });
  const resolvedFilterType: DungeonLogsFilterType | undefined =
    filter === ALL_FILTER_VALUE ? undefined : filter;
  const from = buildRangeBoundary(dateRange.start, "start");
  const to = buildRangeBoundary(dateRange.end, "end");
  const handleResetFilters = () => {
    setFilter(ALL_FILTER_VALUE);
    setDateRange({ start: "", end: "" });
  };

  return (
    <section className="space-y-6">
      <header>
        <h1
          className="font-pixel-title pixel-page-title"
          data-text={t("logs.page.title")}
        >
          {t("logs.page.title")}
        </h1>
      </header>

      <div className="space-y-4">
        <DungeonLogFiltersPanel
          value={filter}
          onChange={setFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <PixelPanel
          className="pixel-log-panel p-4"
          contentClassName="space-y-4"
        >
          <DungeonLogTimeline
            filterType={resolvedFilterType}
            from={from}
            to={to}
            onResetFilter={handleResetFilters}
          />
        </PixelPanel>
      </div>
    </section>
  );
}
