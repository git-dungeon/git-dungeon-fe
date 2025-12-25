import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProfileCard } from "./settings-profile-card";

const formatDateTimeMock = vi.fn<[string | number | Date], string>();
const formatRelativeTimeMock = vi.fn<[string | number | Date], string>();

vi.mock("@/shared/lib/datetime/formatters", () => ({
  formatDateTime: (value: string | number | Date) => formatDateTimeMock(value),
  formatRelativeTime: (value: string | number | Date) =>
    formatRelativeTimeMock(value),
}));

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

describe("SettingsProfileCard", () => {
  beforeEach(() => {
    formatDateTimeMock.mockReturnValue("2025-10-21 09:00");
    formatRelativeTimeMock.mockReturnValue("방금");
  });

  it("프로필 기본 정보를 표시한다", () => {
    const profile = {
      userId: "user-123",
      username: "mock-user",
      displayName: "Mocked Adventurer",
      email: "mock@example.com",
      avatarUrl: undefined,
      joinedAt: "2025-10-21T00:00:00.000Z",
    } as const;
    const connections = {
      github: {
        connected: true,
        lastSyncAt: "2025-10-20T23:00:00.000Z",
      },
    } as const;

    const { container, unmount } = render(
      <SettingsProfileCard profile={profile} connections={connections} />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("계정 세부 정보를 표시합니다.");
    expect(textContent).toContain("mock@example.com");
    expect(textContent).toContain("user-123");
    expect(formatDateTimeMock).toHaveBeenCalledWith(profile.joinedAt);
    expect(formatRelativeTimeMock).toHaveBeenCalledWith(profile.joinedAt);

    unmount();
  });

  it("이메일이 없으면 대체 표시를 사용한다", () => {
    const profile = {
      userId: "user-456",
      username: "anonymous",
      displayName: undefined,
      email: undefined,
      avatarUrl: undefined,
      joinedAt: undefined,
    } as const;

    const { container, unmount } = render(
      <SettingsProfileCard
        profile={profile}
        connections={{ github: { connected: false } }}
      />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("anonymous");
    expect(textContent).toContain("이메일");
    expect(textContent).toContain("-");
    expect(textContent).toContain("가입일");
    expect(textContent).toContain("미기록");

    unmount();
  });
});
