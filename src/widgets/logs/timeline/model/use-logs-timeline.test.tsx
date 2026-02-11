import React, { act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import type { FetchLogsParams } from "@/entities/logs/api/get-logs";
import type { LogsFilterType } from "@/entities/logs/model/types";
import { useLogsTimeline } from "./use-logs-timeline";

const useLogsPageMock = vi.fn();

vi.mock("@/entities/logs/model/use-logs-page", () => ({
  useLogsPage: (...args: unknown[]) => useLogsPageMock(...args),
}));

type QueryMockResult = {
  data: { logs: Array<{ id: string }>; nextCursor: string | null };
  status: "success";
  error: null;
  isFetching: boolean;
  refetch: () => void;
};

let latestState: ReturnType<typeof useLogsTimeline> | null = null;
const refetchByKey = new Map<string, ReturnType<typeof vi.fn>>();

function queryKey(params?: FetchLogsParams): string {
  return `${params?.type ?? "ALL"}|${params?.cursor ?? "FIRST"}`;
}

function buildQueryResult(params?: FetchLogsParams): QueryMockResult {
  const key = queryKey(params);
  const refetch = refetchByKey.get(key) ?? vi.fn();
  refetchByKey.set(key, refetch);

  if (params?.type === "BATTLE") {
    return {
      data: {
        logs: [{ id: "battle-page-1" }],
        nextCursor: "battle-cursor-1",
      },
      status: "success",
      error: null,
      isFetching: false,
      refetch,
    };
  }

  if (params?.cursor === "cursor-1") {
    return {
      data: {
        logs: [{ id: "default-page-2" }],
        nextCursor: null,
      },
      status: "success",
      error: null,
      isFetching: false,
      refetch,
    };
  }

  return {
    data: {
      logs: [{ id: "default-page-1" }],
      nextCursor: "cursor-1",
    },
    status: "success",
    error: null,
    isFetching: false,
    refetch,
  };
}

function Harness({ filterType }: { filterType?: LogsFilterType }) {
  latestState = useLogsTimeline({ filterType });

  return (
    <div>
      <button
        type="button"
        data-testid="next"
        onClick={() => latestState?.fetchNextPage()}
      >
        next
      </button>
      <button
        type="button"
        data-testid="prev"
        onClick={() => latestState?.fetchPreviousPage()}
      >
        prev
      </button>
      <button
        type="button"
        data-testid="refresh"
        onClick={() => latestState?.refetch()}
      >
        refresh
      </button>
      <span data-testid="page-number">{latestState?.pageNumber ?? 0}</span>
      <span data-testid="log-id">{latestState?.logs[0]?.id ?? ""}</span>
    </div>
  );
}

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  return {
    container,
    rerender: (nextUi: React.ReactElement) => {
      act(() => {
        root.render(nextUi);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
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
  latestState = null;
  refetchByKey.clear();
  useLogsPageMock.mockReset();
  useLogsPageMock.mockImplementation((params?: FetchLogsParams) =>
    buildQueryResult(params)
  );
});

describe("useLogsTimeline", () => {
  it("이전/다음 이동 시 페이지 번호와 버튼 상태를 갱신한다", () => {
    const { container, unmount } = render(<Harness />);

    const nextButton = container.querySelector(
      '[data-testid="next"]'
    ) as HTMLButtonElement;
    const prevButton = container.querySelector(
      '[data-testid="prev"]'
    ) as HTMLButtonElement;

    expect(
      container.querySelector('[data-testid="page-number"]')?.textContent
    ).toBe("1");
    expect(latestState?.hasPreviousPage).toBe(false);
    expect(latestState?.hasNextPage).toBe(true);

    act(() => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(
      container.querySelector('[data-testid="page-number"]')?.textContent
    ).toBe("2");
    expect(container.querySelector('[data-testid="log-id"]')?.textContent).toBe(
      "default-page-2"
    );
    expect(latestState?.hasPreviousPage).toBe(true);
    expect(latestState?.hasNextPage).toBe(false);

    act(() => {
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(
      container.querySelector('[data-testid="page-number"]')?.textContent
    ).toBe("1");
    expect(container.querySelector('[data-testid="log-id"]')?.textContent).toBe(
      "default-page-1"
    );
    expect(latestState?.hasPreviousPage).toBe(false);

    unmount();
  });

  it("필터가 변경되면 첫 페이지(cursor 없음)로 초기화한다", () => {
    const { container, rerender, unmount } = render(<Harness />);

    const nextButton = container.querySelector(
      '[data-testid="next"]'
    ) as HTMLButtonElement;

    expect(container.querySelector('[data-testid="log-id"]')?.textContent).toBe(
      "default-page-1"
    );

    act(() => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.querySelector('[data-testid="log-id"]')?.textContent).toBe(
      "default-page-2"
    );

    rerender(<Harness filterType="BATTLE" />);

    expect(container.querySelector('[data-testid="log-id"]')?.textContent).toBe(
      "battle-page-1"
    );
    expect(useLogsPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "BATTLE",
        cursor: undefined,
      })
    );
    expect(useLogsPageMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "BATTLE",
        cursor: "cursor-1",
      })
    );

    unmount();
  });

  it("새로고침은 현재 페이지의 refetch를 호출한다", () => {
    const { container, unmount } = render(<Harness />);

    const nextButton = container.querySelector(
      '[data-testid="next"]'
    ) as HTMLButtonElement;
    const refreshButton = container.querySelector(
      '[data-testid="refresh"]'
    ) as HTMLButtonElement;

    act(() => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const page1Refetch = refetchByKey.get("ALL|FIRST");
    const page2Refetch = refetchByKey.get("ALL|cursor-1");

    expect(page1Refetch).toBeDefined();
    expect(page2Refetch).toBeDefined();

    act(() => {
      refreshButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(page2Refetch).toHaveBeenCalledTimes(1);
    expect(page1Refetch).toHaveBeenCalledTimes(0);

    unmount();
  });
});
