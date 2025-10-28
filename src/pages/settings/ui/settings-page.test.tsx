import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { SettingsPage } from "./settings-page";

const useProfileMock = vi.fn();
const useLogoutMock = vi.fn(() => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
}));

vi.mock("@/entities/profile/model/use-profile", () => ({
  useProfile: () => useProfileMock(),
}));

vi.mock("@/features/auth/logout/model/use-logout", () => ({
  useLogout: () => useLogoutMock(),
}));

vi.mock("@/widgets/settings-preferences/ui/settings-preferences-card", () => ({
  SettingsPreferencesCard: () => (
    <div data-testid="settings-preferences">Preferences</div>
  ),
}));

vi.mock(
  "@/widgets/settings-embedding/ui/settings-embedding-preview-card",
  () => ({
    SettingsEmbeddingPreviewCard: () => (
      <div data-testid="settings-embedding">Embedding</div>
    ),
  })
);

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

describe("SettingsPage", () => {
  beforeEach(() => {
    useProfileMock.mockReset();
  });

  it("프로필 쿼리가 로딩 중이면 스켈레톤 카드를 렌더링한다", () => {
    useProfileMock.mockReturnValue(
      createQueryState({
        isLoading: true,
      })
    );

    const { container, unmount } = render(<SettingsPage />);

    const skeletonCard = container.querySelector(".animate-pulse");
    expect(skeletonCard).not.toBeNull();
    expect(container.textContent).toContain("설정");

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

    const { container, unmount } = render(<SettingsPage />);

    expect(container.textContent).toContain(
      "설정 정보를 불러오지 못했습니다. 다시 시도해 주세요."
    );
    const retryButton = container.querySelector("button[class*='destructive']");
    expect(retryButton).not.toBeNull();

    await act(async () => {
      retryButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(refetchMock).toHaveBeenCalledTimes(1);
    // 세션 오류 문구가 중복 노출되지 않는지 확인
    expect(container.textContent).not.toContain(
      "세션 정보를 불러올 수 없습니다."
    );

    unmount();
  });

  it("프로필 데이터를 불러오면 계정 정보 카드를 표시한다", () => {
    useProfileMock.mockReturnValue(
      createQueryState({
        data: {
          profile: {
            userId: "user-123",
            username: "mock-user",
            displayName: "Mocked Adventurer",
            email: "mock@example.com",
            avatarUrl: "https://example.com/avatar.png",
            joinedAt: "2025-10-21T00:00:00.000Z",
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

    const { container, unmount } = render(<SettingsPage />);

    expect(container.textContent).toContain("계정 정보");
    expect(container.textContent).toContain("Mocked Adventurer");
    expect(
      container.querySelector("[data-testid='settings-preferences']")
    ).not.toBeNull();
    expect(
      container.querySelector("[data-testid='settings-embedding']")
    ).not.toBeNull();

    unmount();
  });
});
