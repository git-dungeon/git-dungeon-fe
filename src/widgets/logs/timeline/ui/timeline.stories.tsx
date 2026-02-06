import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo, type ReactElement } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogsTimeline } from "@/widgets/logs/timeline/ui/timeline";
import { LOGS_PAGE_SIZE } from "@/widgets/logs/timeline/config/constants";
import type { LogEntry, LogsPayload } from "@/entities/logs/model/types";
import { sampleLogs } from "@/mocks/fixtures/storybook";

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
      "logs",
      "infinite",
      {
        limit: LOGS_PAGE_SIZE,
        type: null,
        from: null,
        to: null,
      },
    ] as const;

    const storyLogs: LogEntry[] = sampleLogs.map((log) => {
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

    const payload: InfiniteData<LogsPayload> = {
      pages: [
        {
          logs: storyLogs.slice(0, LOGS_PAGE_SIZE),
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

const meta: Meta<typeof LogsTimeline> = {
  title: "widgets/logs/Timeline",
  component: LogsTimeline,
  decorators: [withLogData],
};

export default meta;

type Story = StoryObj<typeof LogsTimeline>;

export const Default: Story = {};
