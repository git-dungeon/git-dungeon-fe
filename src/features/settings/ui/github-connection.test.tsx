import React, { StrictMode, act } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { ApiError } from "@/shared/api/http-client";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";
import { GithubConnection } from "./github-connection";

const useGithubSyncStatusMock = vi.fn(() => ({
  data: null as unknown,
  isLoading: false,
  isError: false,
  refetch: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/entities/github/model/use-github-sync-status", () => ({
  useGithubSyncStatus: () => useGithubSyncStatusMock(),
}));

const mutateAsyncMock = vi.fn();
const useGithubSyncMock = vi.fn(() => ({
  mutateAsync: mutateAsyncMock,
  isPending: false,
  error: null as Error | null,
}));

vi.mock("@/features/settings/model/use-github-sync", () => ({
  useGithubSync: () => useGithubSyncMock(),
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

describe("GithubConnection", () => {
  afterEach(() => {
    vi.useRealTimers();
    mutateAsyncMock.mockReset();
    useGithubSyncMock.mockReset();
    useGithubSyncMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: null as Error | null,
    });
    useGithubSyncStatusMock.mockReset();
    useGithubSyncStatusMock.mockReturnValue({
      data: null as unknown,
      isLoading: false,
      isError: false,
      refetch: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("연결된 상태 정보를 표시한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-10-21T04:00:00.000Z"));

    const nextAvailableAt = new Date("2025-10-21T06:00:00.000Z");
    useGithubSyncStatusMock.mockReturnValue({
      data: {
        connected: true,
        allowed: false,
        cooldownMs: 21600000,
        lastSyncAt: "2025-10-21T01:00:00.000Z",
        lastManualSyncAt: "2025-10-21T01:00:00.000Z",
        nextAvailableAt: nextAvailableAt.toISOString(),
        retryAfterMs: 1000,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn().mockResolvedValue(undefined),
    });

    const { container, unmount } = render(
      <GithubConnection
        connections={{
          github: { connected: true, lastSyncAt: "2025-10-21T01:00:00.000Z" },
        }}
      />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("GitHub 연동");
    expect(textContent).toContain("새로고침");
    expect(textContent).toContain(
      `다음 새로고침 가능 ${formatRelativeTime(nextAvailableAt)}`
    );
    expect(textContent).toContain(formatDateTime(nextAvailableAt));

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect((button as HTMLButtonElement).disabled).toBe(true);

    unmount();
  });

  it("미연결 상태 메시지를 안내한다", () => {
    const { container, unmount } = render(
      <GithubConnection connections={{ github: { connected: false } }} />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("미연결");
    expect(textContent).toContain("계정을 연동하면 커밋 통계가 표시됩니다.");
    expect(textContent).not.toContain("새로고침");

    unmount();
  });

  it("409 오류는 안내 메시지를 표시한다", () => {
    useGithubSyncStatusMock.mockReturnValue({
      data: {
        connected: true,
        allowed: true,
        cooldownMs: 21600000,
        lastSyncAt: null,
        lastManualSyncAt: null,
        nextAvailableAt: null,
        retryAfterMs: null,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn().mockResolvedValue(undefined),
    });

    useGithubSyncMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: new ApiError("Conflict", 409, {
        error: { message: "쿨다운입니다.", code: "GITHUB_SYNC_TOO_FREQUENT" },
      }) as unknown as Error,
    });

    const { container, unmount } = render(
      <GithubConnection connections={{ github: { connected: true } }} />
    );

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).not.toBeNull();
    expect(alertElement?.textContent).toContain(
      "현재 동기화를 진행할 수 없습니다"
    );

    unmount();
  });
});
