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

const ALL_FILTER_VALUE = "ALL" as const;
type LogsFilterSelection = typeof ALL_FILTER_VALUE | DungeonLogsFilterType;

const FILTER_LABEL_MAP: Record<LogsFilterSelection, string> = {
  ALL: "전체",
  EXPLORATION: "탐험(카테고리)",
  STATUS: "상태(카테고리)",
  BATTLE: "전투",
  TREASURE: "보물",
  REST: "휴식",
  TRAP: "함정",
  MOVE: "이동",
  DEATH: "사망",
  REVIVE: "부활",
  ACQUIRE_ITEM: "아이템 획득",
  EQUIP_ITEM: "장착",
  UNEQUIP_ITEM: "해제",
  DISCARD_ITEM: "버리기",
  BUFF_APPLIED: "버프 적용",
  BUFF_EXPIRED: "버프 종료",
  LEVEL_UP: "레벨 업",
};

const FILTER_DESCRIPTION_MAP: Partial<Record<LogsFilterSelection, string>> = {
  ALL: "모든 기록을 확인합니다.",
  EXPLORATION: "탐험 카테고리 로그만 확인합니다.",
  STATUS: "상태 변경 카테고리 로그만 확인합니다.",
};

const CATEGORY_FILTERS: DungeonLogsFilterType[] = ["EXPLORATION", "STATUS"];
const ACTION_FILTERS: DungeonLogsFilterType[] =
  DUNGEON_LOGS_FILTER_TYPES.filter(
    (value) => !CATEGORY_FILTERS.includes(value)
  );

export function LogsPage() {
  const [filter, setFilter] = useState<LogsFilterSelection>(ALL_FILTER_VALUE);
  const resolvedFilterType: DungeonLogsFilterType | undefined =
    filter === ALL_FILTER_VALUE ? undefined : filter;
  const description = FILTER_DESCRIPTION_MAP[filter];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-foreground text-2xl font-semibold">탐험 기록</h1>
        <p className="text-muted-foreground text-sm">
          진행된 기록을 확인합니다.
        </p>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">필터</p>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as LogsFilterSelection)}
            >
              <SelectTrigger className="min-w-64">
                <SelectValue placeholder="필터를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>
                  {FILTER_LABEL_MAP[ALL_FILTER_VALUE]}
                </SelectItem>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>카테고리</SelectLabel>
                  {CATEGORY_FILTERS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {FILTER_LABEL_MAP[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>액션</SelectLabel>
                  {ACTION_FILTERS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {FILTER_LABEL_MAP[value]}
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
