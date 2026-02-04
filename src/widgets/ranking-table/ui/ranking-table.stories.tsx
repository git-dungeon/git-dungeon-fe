import type { Meta, StoryObj } from "@storybook/react";
import { RankingTable } from "@/widgets/ranking-table/ui/ranking-table";
import type { RankingEntry } from "@/entities/ranking/model/types";

const meta: Meta<typeof RankingTable> = {
  title: "widgets/RankingTable",
  component: RankingTable,
  parameters: {
    layout: "padded",
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof RankingTable>;

const sampleRankings: RankingEntry[] = [
  {
    rank: 1,
    userId: "user-1",
    username: "tester",
    displayName: "Tester",
    avatarUrl: null,
    level: 12,
    maxFloor: 23,
  },
  {
    rank: 2,
    userId: "user-2",
    username: "runner-up",
    displayName: "Runner",
    avatarUrl: null,
    level: 10,
    maxFloor: 21,
  },
];

export const Default: Story = {
  args: {
    rankings: sampleRankings,
    status: "success",
    error: null,
    isFetching: false,
    fetchNextPage: async () => undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: async () => undefined,
  },
};

export const Pending: Story = {
  args: {
    rankings: [],
    status: "pending",
    error: null,
    isFetching: false,
    fetchNextPage: async () => undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: async () => undefined,
  },
};

export const Empty: Story = {
  args: {
    rankings: [],
    status: "success",
    error: null,
    isFetching: false,
    fetchNextPage: async () => undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: async () => undefined,
  },
};

export const ErrorState: Story = {
  args: {
    rankings: [],
    status: "error",
    error: new Error("랭킹 조회에 실패했습니다."),
    isFetching: false,
    fetchNextPage: async () => undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: async () => undefined,
  },
};
