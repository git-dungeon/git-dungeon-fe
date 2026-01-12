import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { OnboardingPage } from "./onboarding-page";

const navigateMock = vi.fn();
const refetchMock = vi.fn().mockResolvedValue(undefined);
const mutateAsyncMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/entities/github/model/use-github-sync-status", () => ({
  useGithubSyncStatus: () => ({
    data: { connected: true, allowed: true },
    isLoading: false,
    refetch: refetchMock,
  }),
}));

vi.mock("@/features/settings/model/use-github-sync", () => ({
  useGithubSync: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    error: null,
  }),
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

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("OnboardingPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    refetchMock.mockReset();
    mutateAsyncMock.mockReset();
  });

  it("AP 계산 버튼 클릭 시 수동 동기화 후 대시보드로 이동한다", async () => {
    const { container, unmount } = render(<OnboardingPage />);
    const button = container.querySelector("button");

    expect(button).not.toBeNull();

    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushPromises();
    });

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    expect(refetchMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/dashboard" });

    unmount();
  });
});
