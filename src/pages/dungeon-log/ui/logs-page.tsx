import { useState } from "react";
import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { DUNGEON_LOGS_FILTER_TYPES } from "@/entities/dungeon-log/model/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";
import { useTranslation } from "react-i18next";

const ALL_FILTER_VALUE = "ALL" as const;
type LogsFilterSelection = typeof ALL_FILTER_VALUE | DungeonLogsFilterType;

const CATEGORY_FILTERS: DungeonLogsFilterType[] = ["EXPLORATION", "STATUS"];
const ACTION_FILTERS: DungeonLogsFilterType[] =
  DUNGEON_LOGS_FILTER_TYPES.filter(
    (value) => !CATEGORY_FILTERS.includes(value)
  );

export function LogsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LogsFilterSelection>(ALL_FILTER_VALUE);
  const resolvedFilterType: DungeonLogsFilterType | undefined =
    filter === ALL_FILTER_VALUE ? undefined : filter;
  const filterLabelMap: Record<LogsFilterSelection, string> = {
    ALL: t("logs.filters.labels.ALL"),
    EXPLORATION: t("logs.filters.labels.EXPLORATION"),
    STATUS: t("logs.filters.labels.STATUS"),
    BATTLE: t("logs.filters.labels.BATTLE"),
    TREASURE: t("logs.filters.labels.TREASURE"),
    REST: t("logs.filters.labels.REST"),
    TRAP: t("logs.filters.labels.TRAP"),
    MOVE: t("logs.filters.labels.MOVE"),
    DEATH: t("logs.filters.labels.DEATH"),
    REVIVE: t("logs.filters.labels.REVIVE"),
    ACQUIRE_ITEM: t("logs.filters.labels.ACQUIRE_ITEM"),
    EQUIP_ITEM: t("logs.filters.labels.EQUIP_ITEM"),
    UNEQUIP_ITEM: t("logs.filters.labels.UNEQUIP_ITEM"),
    DISCARD_ITEM: t("logs.filters.labels.DISCARD_ITEM"),
    BUFF_APPLIED: t("logs.filters.labels.BUFF_APPLIED"),
    BUFF_EXPIRED: t("logs.filters.labels.BUFF_EXPIRED"),
    LEVEL_UP: t("logs.filters.labels.LEVEL_UP"),
  };
  const filterDescriptionMap: Partial<Record<LogsFilterSelection, string>> = {
    ALL: t("logs.filters.descriptions.ALL"),
    EXPLORATION: t("logs.filters.descriptions.EXPLORATION"),
    STATUS: t("logs.filters.descriptions.STATUS"),
  };
  const description = filterDescriptionMap[filter];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-foreground text-2xl font-semibold">
          {t("logs.page.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("logs.page.subtitle")}
        </p>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">
              {t("logs.filters.title")}
            </p>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as LogsFilterSelection)}
            >
              <SelectTrigger className="min-w-64">
                <SelectValue placeholder={t("logs.filters.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>
                  {filterLabelMap[ALL_FILTER_VALUE]}
                </SelectItem>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>{t("logs.filters.groups.category")}</SelectLabel>
                  {CATEGORY_FILTERS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {filterLabelMap[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>{t("logs.filters.groups.action")}</SelectLabel>
                  {ACTION_FILTERS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {filterLabelMap[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}

        <DungeonLogTimeline
          filterType={resolvedFilterType}
          onResetFilter={() => setFilter(ALL_FILTER_VALUE)}
        />
      </div>
    </section>
  );
}
