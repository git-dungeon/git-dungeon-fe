import type { Meta, StoryObj } from "@storybook/react";
import { RankingTable } from "@/widgets/ranking-table/ui/ranking-table";
import type { RankingEntry } from "@/entities/ranking/model/types";
import type { RankingListState } from "@/features/ranking-list/model/use-ranking-list";

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
    displayName: "Tester",
    avatarUrl: null,
    level: 12,
    maxFloor: 23,
  },
  {
    rank: 2,
    displayName: "Runner",
    avatarUrl: null,
    level: 10,
    maxFloor: 21,
  },
];

const fetchNextPageStub: RankingListState["fetchNextPage"] = () =>
  Promise.resolve({} as never);

const refetchStub: RankingListState["refetch"] = () =>
  Promise.resolve({} as never);

export const Default: Story = {
  args: {
    rankings: sampleRankings,
    status: "success",
    error: null,
    isFetching: false,
    fetchNextPage: fetchNextPageStub,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: refetchStub,
  },
};

export const Pending: Story = {
  args: {
    rankings: [],
    status: "pending",
    error: null,
    isFetching: false,
    fetchNextPage: fetchNextPageStub,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: refetchStub,
  },
};

export const Empty: Story = {
  args: {
    rankings: [],
    status: "success",
    error: null,
    isFetching: false,
    fetchNextPage: fetchNextPageStub,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: refetchStub,
  },
};

export const ErrorState: Story = {
  args: {
    rankings: [],
    status: "error",
    error: new Error("랭킹 조회에 실패했습니다."),
    isFetching: false,
    fetchNextPage: fetchNextPageStub,
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: refetchStub,
  },
};
