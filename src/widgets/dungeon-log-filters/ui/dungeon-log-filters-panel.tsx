import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { DUNGEON_LOGS_FILTER_TYPES } from "@/entities/dungeon-log/model/types";
import { PixelPanel } from "@/shared/ui/pixel-panel";
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
import { useTranslation } from "react-i18next";

export const ALL_FILTER_VALUE = "ALL" as const;
export type LogsFilterSelection =
  | typeof ALL_FILTER_VALUE
  | DungeonLogsFilterType;

export interface DateRangeState {
  start: string;
  end: string;
}

interface DungeonLogFiltersPanelProps {
  value: LogsFilterSelection;
  onChange: (value: LogsFilterSelection) => void;
  dateRange: DateRangeState;
  onDateRangeChange: (next: DateRangeState) => void;
}

const CATEGORY_FILTERS: DungeonLogsFilterType[] = ["EXPLORATION", "STATUS"];
const ACTION_FILTERS: DungeonLogsFilterType[] =
  DUNGEON_LOGS_FILTER_TYPES.filter(
    (value) => !CATEGORY_FILTERS.includes(value)
  );

export function DungeonLogFiltersPanel({
  value,
  onChange,
  dateRange,
  onDateRangeChange,
}: DungeonLogFiltersPanelProps) {
  const { t } = useTranslation();
  const filterLabelMap: Record<LogsFilterSelection, string> = {
    ALL: t("logs.filters.labels.ALL"),
    EXPLORATION: t("logs.filters.labels.EXPLORATION"),
    STATUS: t("logs.filters.labels.STATUS"),
    BATTLE: t("logs.filters.labels.BATTLE"),
    TREASURE: t("logs.filters.labels.TREASURE"),
    REST: t("logs.filters.labels.REST"),
    TRAP: t("logs.filters.labels.TRAP"),
    EMPTY: t("logs.filters.labels.EMPTY"),
    MOVE: t("logs.filters.labels.MOVE"),
    DEATH: t("logs.filters.labels.DEATH"),
    REVIVE: t("logs.filters.labels.REVIVE"),
    ACQUIRE_ITEM: t("logs.filters.labels.ACQUIRE_ITEM"),
    EQUIP_ITEM: t("logs.filters.labels.EQUIP_ITEM"),
    UNEQUIP_ITEM: t("logs.filters.labels.UNEQUIP_ITEM"),
    DISCARD_ITEM: t("logs.filters.labels.DISCARD_ITEM"),
    DISMANTLE_ITEM: t("logs.filters.labels.DISMANTLE_ITEM"),
    ENHANCE_ITEM: t("logs.filters.labels.ENHANCE_ITEM"),
    BUFF_APPLIED: t("logs.filters.labels.BUFF_APPLIED"),
    BUFF_EXPIRED: t("logs.filters.labels.BUFF_EXPIRED"),
    LEVEL_UP: t("logs.filters.labels.LEVEL_UP"),
    STAT_APPLIED: t("logs.filters.labels.STAT_APPLIED"),
  };
  const filterDescriptionMap: Partial<Record<LogsFilterSelection, string>> = {
    ALL: t("logs.filters.descriptions.ALL"),
    EXPLORATION: t("logs.filters.descriptions.EXPLORATION"),
    STATUS: t("logs.filters.descriptions.STATUS"),
  };
  const description = filterDescriptionMap[value];

  return (
    <PixelPanel
      title={t("logs.filters.title")}
      className="p-4"
      contentClassName="space-y-3"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <Select
            value={value}
            onValueChange={(next) => onChange(next as LogsFilterSelection)}
          >
            <SelectTrigger className="pixel-select-trigger min-w-64">
              <SelectValue placeholder={t("logs.filters.placeholder")} />
            </SelectTrigger>
            <SelectContent className="pixel-select-content">
              <SelectItem value={ALL_FILTER_VALUE}>
                {filterLabelMap[ALL_FILTER_VALUE]}
              </SelectItem>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel className="pixel-select-label">
                  {t("logs.filters.groups.category")}
                </SelectLabel>
                {CATEGORY_FILTERS.map((filterValue) => (
                  <SelectItem
                    key={filterValue}
                    value={filterValue}
                    className="pixel-select-item"
                  >
                    {filterLabelMap[filterValue]}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel className="pixel-select-label">
                  {t("logs.filters.groups.action")}
                </SelectLabel>
                {ACTION_FILTERS.map((filterValue) => (
                  <SelectItem
                    key={filterValue}
                    value={filterValue}
                    className="pixel-select-item"
                  >
                    {filterLabelMap[filterValue]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {description ? (
            <p className="pixel-text-muted text-sm">{description}</p>
          ) : null}
        </div>
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="pixel-text-muted text-xs">
                {t("logs.filters.dateRange.from")}
              </span>
              <input
                type="date"
                value={dateRange.start}
                max={dateRange.end || undefined}
                onChange={(event) =>
                  onDateRangeChange({
                    ...dateRange,
                    start: event.target.value,
                  })
                }
                className="pixel-select-trigger w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="pixel-text-muted text-xs">
                {t("logs.filters.dateRange.to")}
              </span>
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start || undefined}
                onChange={(event) =>
                  onDateRangeChange({
                    ...dateRange,
                    end: event.target.value,
                  })
                }
                className="pixel-select-trigger w-full"
              />
            </label>
          </div>
          <p className="pixel-text-muted text-xs">
            {t("logs.filters.dateRange.hint")}
          </p>
        </div>
      </div>
    </PixelPanel>
  );
}
