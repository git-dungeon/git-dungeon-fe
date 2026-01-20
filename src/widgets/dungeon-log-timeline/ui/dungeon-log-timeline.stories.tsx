import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo, type ReactElement } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";
import { DUNGEON_LOGS_PAGE_SIZE } from "@/widgets/dungeon-log-timeline/config/constants";
import type { DungeonLogsPayload } from "@/entities/dungeon-log/model/types";
import { sampleDungeonLogs } from "@/mocks/fixtures/storybook";

const withLogData: Decorator = (Story) => <LogDataProvider Story={Story} />;

function LogDataProvider({ Story }: { Story: () => ReactElement }) {
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: Number.POSITIVE_INFINITY,
        },
      },
    });

    const queryKey = [
      "dungeon-logs",
      "infinite",
      {
        limit: DUNGEON_LOGS_PAGE_SIZE,
        type: null,
        from: null,
        to: null,
      },
    ] as const;

    const payload: InfiniteData<DungeonLogsPayload> = {
      pages: [
        {
          logs: sampleDungeonLogs.slice(0, DUNGEON_LOGS_PAGE_SIZE),
          nextCursor: null,
        },
      ],
      pageParams: [undefined],
    };

    client.setQueryData(queryKey, payload);

    return client;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
}

const meta: Meta<typeof DungeonLogTimeline> = {
  title: "widgets/DungeonLogTimeline",
  component: DungeonLogTimeline,
  decorators: [withLogData],
};

export default meta;

type Story = StoryObj<typeof DungeonLogTimeline>;

export const Default: Story = {};
