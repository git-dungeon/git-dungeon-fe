import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";

const LOGS_TAB_ITEMS = [
  {
    value: "all",
    label: "전체",
    description: "모든 기록을 확인합니다.",
  },
  {
    value: "exploration",
    label: "탐험",
    description: "전투, 휴식, 함정 등 탐험과 관련된 기록을 확인합니다.",
  },
  {
    value: "status",
    label: "상태",
    description: "플레이어의 상태 변경과 관련된 기록을 확인합니다.",
  },
] as const;

export function LogsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-foreground text-2xl font-semibold">탐험 기록</h1>
        <p className="text-muted-foreground text-sm">
          진행된 기록을 확인합니다.
        </p>
      </header>

      <Tabs defaultValue="all" className="space-y-5">
        <TabsList>
          {LOGS_TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {LOGS_TAB_ITEMS[0].description}
          </p>
          <DungeonLogTimeline />
        </TabsContent>

        <TabsContent value="exploration" className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {LOGS_TAB_ITEMS[1].description}
          </p>
          <DungeonLogTimeline category="exploration" />
        </TabsContent>

        <TabsContent value="status" className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {LOGS_TAB_ITEMS[2].description}
          </p>
          <DungeonLogTimeline category="status" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
