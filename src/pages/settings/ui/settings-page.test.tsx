import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsPage } from "./settings-page";
const useLogoutMock = vi.fn(() => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
}));

vi.mock("@/features/auth/logout/model/use-logout", () => ({
  useLogout: () => useLogoutMock(),
}));

vi.mock("@/widgets/settings-profile/ui/settings-profile-section", () => ({
  SettingsProfileSection: () => (
    <div data-testid="settings-profile-section">Profile</div>
  ),
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
  const queryClient = new QueryClient();

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

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("SettingsPage", () => {
  beforeEach(() => {
    useLogoutMock.mockClear();
  });

  it("설정 페이지 주요 섹션을 렌더링한다", () => {
    const { container, unmount } = render(<SettingsPage />);

    expect(container.textContent).toContain("설정");
    expect(
      container.querySelector("[data-testid='settings-profile-section']")
    ).not.toBeNull();
    expect(
      container.querySelector("[data-testid='settings-preferences']")
    ).not.toBeNull();
    expect(
      container.querySelector("[data-testid='settings-embedding']")
    ).not.toBeNull();

    unmount();
  });
});
