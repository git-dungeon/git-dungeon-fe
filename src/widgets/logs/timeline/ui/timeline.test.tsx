import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import type { LogEntry } from "@/entities/logs/model/types";
import { LogsTimeline } from "./timeline";

const useLogsTimelineMock = vi.fn();

vi.mock("@/widgets/logs/timeline/model/use-logs-timeline", () => ({
  useLogsTimeline: (...args: unknown[]) => useLogsTimelineMock(...args),
}));

vi.mock("@/entities/logs/ui/delta-list", () => ({
  DeltaList: () => <div data-testid="delta-list" />,
}));

vi.mock("@/entities/logs/ui/log-card", () => ({
  LogCard: ({ onClick }: { onClick?: () => void }) => (
    <button type="button" data-testid="log-card" onClick={onClick}>
      log-card
    </button>
  ),
}));

vi.mock("@/entities/logs/ui/log-thumbnail-stack", () => ({
  LogThumbnailStack: () => <div data-testid="log-thumb" />,
}));

vi.mock("@/widgets/logs/timeline/ui/detail-dialog", () => ({
  LogsDetailDialog: () => null,
}));

vi.mock("@/entities/logs/config/thumbnails", () => ({
  buildLogThumbnails: () => [],
}));

vi.mock("@/entities/catalog/model/use-catalog-item-name", () => ({
  useCatalogItemNameResolver: () => () => null,
}));

vi.mock("@/entities/catalog/model/use-catalog-monster-name", () => ({
  useCatalogMonsterNameResolver: () => () => null,
}));

vi.mock("@/entities/catalog/model/use-catalog-item-rarity", () => ({
  useCatalogItemRarityResolver: () => () => null,
}));

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<StrictMode>{ui}</StrictMode>);
  });

  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

beforeEach(() => {
  useLogsTimelineMock.mockReset();
});

describe("LogsTimeline", () => {
  it("새로고침 버튼 클릭 시 refetch를 호출한다", () => {
    const refetchMock = vi.fn();
    const logs = [{ id: "log-1" } as LogEntry];

    useLogsTimelineMock.mockReturnValue({
      logs,
      status: "success",
      error: null,
      isFetching: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: refetchMock,
      sentinelRef: { current: null },
    });

    const { container, unmount } = render(<LogsTimeline />);

    const refreshButton = container.querySelector(
      '[data-testid="logs-refresh-button"]'
    ) as HTMLButtonElement;
    expect(refreshButton).not.toBeNull();

    act(() => {
      refreshButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(refetchMock).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("로딩 중에는 새로고침 버튼이 비활성화된다", () => {
    const logs = [{ id: "log-1" } as LogEntry];

    useLogsTimelineMock.mockReturnValue({
      logs,
      status: "success",
      error: null,
      isFetching: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
      sentinelRef: { current: null },
    });

    const { container, unmount } = render(<LogsTimeline />);

    const refreshButton = container.querySelector(
      '[data-testid="logs-refresh-button"]'
    ) as HTMLButtonElement;

    expect(refreshButton.disabled).toBe(true);

    unmount();
  });
});
