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
  function buildTimelineState(overrides: Record<string, unknown> = {}) {
    return {
      logs: [{ id: "log-1" } as LogEntry],
      status: "success",
      error: null,
      isFetching: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      pageNumber: 1,
      refetch: vi.fn(),
      ...overrides,
    };
  }

  it("새로고침 버튼 클릭 시 refetch를 호출한다", () => {
    const refetchMock = vi.fn();

    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({ refetch: refetchMock })
    );

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
    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({ isFetching: true })
    );

    const { container, unmount } = render(<LogsTimeline />);

    const refreshButton = container.querySelector(
      '[data-testid="logs-refresh-button"]'
    ) as HTMLButtonElement;

    expect(refreshButton.disabled).toBe(true);

    unmount();
  });

  it("첫 페이지에서는 이전 버튼이 비활성화되고 마지막 페이지에서는 다음 버튼이 비활성화된다", () => {
    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({
        hasNextPage: false,
        hasPreviousPage: false,
        pageNumber: 1,
      })
    );

    const { container, unmount } = render(<LogsTimeline />);

    const previousButton = container.querySelector(
      '[data-testid="logs-prev-page-button"]'
    ) as HTMLButtonElement;
    const nextButton = container.querySelector(
      '[data-testid="logs-next-page-button"]'
    ) as HTMLButtonElement;
    const pageNumber = container.querySelector(
      '[data-testid="logs-page-number"]'
    ) as HTMLSpanElement;

    expect(previousButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(true);
    expect(pageNumber.textContent).toContain("1");

    unmount();
  });

  it("이전/다음 버튼 클릭 시 각 페이지 이동 핸들러를 호출한다", () => {
    const fetchPreviousPageMock = vi.fn();
    const fetchNextPageMock = vi.fn();

    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({
        hasNextPage: true,
        hasPreviousPage: true,
        pageNumber: 2,
        fetchPreviousPage: fetchPreviousPageMock,
        fetchNextPage: fetchNextPageMock,
      })
    );

    const { container, unmount } = render(<LogsTimeline />);

    const previousButton = container.querySelector(
      '[data-testid="logs-prev-page-button"]'
    ) as HTMLButtonElement;
    const nextButton = container.querySelector(
      '[data-testid="logs-next-page-button"]'
    ) as HTMLButtonElement;

    act(() => {
      previousButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetchPreviousPageMock).toHaveBeenCalledTimes(1);
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("에러 상태에서는 재시도 버튼만 표시되고 클릭 시 refetch를 호출한다", () => {
    const refetchMock = vi.fn();

    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({
        status: "error",
        error: new Error("boom"),
        refetch: refetchMock,
      })
    );

    const { container, unmount } = render(<LogsTimeline />);

    expect(
      container.querySelector('[data-testid="logs-refresh-button"]')
    ).toBeNull();

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(1);

    act(() => {
      buttons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(refetchMock).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("빈 상태에서는 로그 카드/페이지네이션 컨트롤을 렌더링하지 않는다", () => {
    useLogsTimelineMock.mockReturnValue(
      buildTimelineState({
        logs: [],
      })
    );

    const { container, unmount } = render(<LogsTimeline />);

    expect(container.querySelectorAll('[data-testid="log-card"]').length).toBe(
      0
    );
    expect(
      container.querySelector('[data-testid="logs-prev-page-button"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="logs-next-page-button"]')
    ).toBeNull();

    unmount();
  });
});
