import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo, type ReactElement } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DungeonLogTimeline } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";
import { DUNGEON_LOGS_PAGE_SIZE } from "@/widgets/dungeon-log-timeline/config/constants";
import type {
  DungeonLogEntry,
  DungeonLogsPayload,
} from "@/entities/dungeon-log/model/types";
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

    const storyLogs: DungeonLogEntry[] = sampleDungeonLogs.map((log) => {
      if (log.delta?.type === "BATTLE") {
        const rewards = log.delta.detail.rewards ?? {};
        const items = rewards.items ?? [];
        return {
          ...log,
          delta: {
            ...log.delta,
            detail: {
              ...log.delta.detail,
              rewards: {
                ...rewards,
                items: [
                  ...items,
                  {
                    code: "ring-silver-band",
                    quantity: 1,
                  },
                ],
              },
            },
          },
        };
      }

      if (log.delta?.type === "ACQUIRE_ITEM") {
        const inventory = log.delta.detail.inventory;
        const addedItems = inventory.added ?? [];
        return {
          ...log,
          delta: {
            ...log.delta,
            detail: {
              ...log.delta.detail,
              inventory: {
                ...inventory,
                added: [
                  ...addedItems,
                  {
                    itemId: "inv-004-bonus",
                    code: "weapon-short-sword",
                    slot: "weapon",
                    quantity: 1,
                  },
                ],
              },
            },
          },
        };
      }

      return log;
    });

    const payload: InfiniteData<DungeonLogsPayload> = {
      pages: [
        {
          logs: storyLogs.slice(0, DUNGEON_LOGS_PAGE_SIZE),
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
