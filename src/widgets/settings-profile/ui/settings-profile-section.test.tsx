import React, { StrictMode, act } from "react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProfileSection } from "./settings-profile-section";
import type { MockInstance } from "@vitest/spy";

const useProfileMock = vi.fn();

vi.mock("@/entities/profile/model/use-profile", () => ({
  useProfile: () => useProfileMock(),
}));

vi.mock("@/widgets/settings-profile/ui/settings-profile-card", () => ({
  SettingsProfileCard: ({ profile }: { profile: { userId: string } }) => (
    <div data-testid="settings-profile-card">{profile.userId}</div>
  ),
}));

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  act(() => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </StrictMode>
    );
  });

  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

type MockProfileQuery = {
  isLoading: boolean;
  isError: boolean;
  data: unknown;
  refetch: () => Promise<unknown>;
};

const createQueryState = (
  overrides: Partial<MockProfileQuery>
): MockProfileQuery => ({
  isLoading: false,
  isError: false,
  data: null,
  refetch: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("SettingsProfileSection", () => {
  let consoleErrorSpy: MockInstance<
    [message?: unknown, ...optionalParams: unknown[]],
    void
  > | null = null;

  beforeEach(() => {
    useProfileMock.mockReset();
    document.body.innerHTML = "";
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    consoleErrorSpy = null;
  });

  it("프로필 쿼리가 로딩 중이면 스켈레톤 카드를 렌더링한다", () => {
    useProfileMock.mockReturnValue(
      createQueryState({
        isLoading: true,
      })
    );

    const { container, unmount } = render(<SettingsProfileSection />);

    const skeletonCard = container.querySelector(".pixel-skeleton");
    expect(skeletonCard).not.toBeNull();
    expect(container.textContent).toContain("계정 정보");

    unmount();
  });

  it("프로필 쿼리 오류 시 에러 카드를 표시한다", async () => {
    const refetchMock = vi.fn().mockResolvedValue(undefined);
    useProfileMock.mockReturnValue(
      createQueryState({
        isError: true,
        refetch: refetchMock,
      })
    );

    const { container, unmount } = render(<SettingsProfileSection />);

    expect(container.textContent).toContain(
      "설정 정보를 불러오지 못했습니다. 다시 시도해 주세요."
    );
    const retryButton = container.querySelector("button");
    expect(retryButton).not.toBeNull();

    await act(async () => {
      retryButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(refetchMock).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("프로필 데이터를 불러오면 계정 정보 카드를 표시한다", () => {
    useProfileMock.mockReturnValue(
      createQueryState({
        data: {
          profile: {
            userId: "user-123",
            username: "mock-user",
          },
          connections: {
            github: {
              connected: true,
              lastSyncAt: "2025-10-21T01:00:00.000Z",
            },
          },
        },
      })
    );

    const { container, unmount } = render(<SettingsProfileSection />);

    expect(
      container.querySelector("[data-testid='settings-profile-card']")
    ).not.toBeNull();
    expect(container.textContent).toContain("user-123");

    unmount();
  });
});
