import React, { StrictMode, act } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { LoginContainer } from "@/pages/login/ui/login-container";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({
    useSearch: () => ({ redirect: undefined }),
  }),
  useNavigate: () => navigateMock,
}));

const useAuthSessionMock = vi.fn();

vi.mock("@/entities/auth/model/use-auth-session", () => ({
  useAuthSession: () => useAuthSessionMock(),
}));

const loginMock = vi.fn();
const useGithubLoginMock = vi.fn(() => ({
  login: loginMock,
  isLoading: false,
  error: null,
}));

vi.mock("@/features/auth/github-login/model/use-github-login", () => ({
  useGithubLogin: () => useGithubLoginMock(),
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

describe("/login 화면", () => {
  beforeEach(() => {
    loginMock.mockReset();
    navigateMock.mockReset();
    loginMock.mockResolvedValue(undefined);
    useGithubLoginMock.mockReturnValue({
      login: loginMock,
      isLoading: false,
      error: null,
    });
    useAuthSessionMock.mockReturnValue({
      data: null,
      isError: false,
      error: null,
      isPending: false,
      isFetching: false,
      isRefetching: false,
    });
  });

  it("로그인 실패 시 에러 메시지를 표시한다", async () => {
    loginMock.mockRejectedValueOnce(new Error("테스트 에러"));
    const { container, unmount } = render(
      <LoginContainer safeRedirect="/dashboard" />
    );

    const button = container.querySelector(
      '[data-testid="github-login-button"]'
    ) as HTMLButtonElement;
    expect(button).not.toBeNull();

    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).not.toBeNull();
    expect(alertElement?.textContent).toBe("테스트 에러");
    expect(navigateMock).not.toHaveBeenCalled();
    expect(button.disabled).toBe(false);

    unmount();
  });

  it("서버 오류 시 로그인 버튼을 비활성화하고 안내 메시지를 표시한다", () => {
    useAuthSessionMock.mockReturnValue({
      data: null,
      isError: true,
      error: new TypeError("Failed to fetch"),
      isPending: false,
      isFetching: false,
      isRefetching: false,
    });

    const { container, unmount } = render(
      <LoginContainer safeRedirect="/dashboard" />
    );

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).not.toBeNull();
    expect(alertElement?.textContent).toBe(
      "서버에 문제가 있어 로그인할 수 없습니다."
    );

    const errorButton = container.querySelector(
      '[data-testid="github-login-button"]'
    ) as HTMLButtonElement;
    expect(errorButton).not.toBeNull();
    expect(errorButton.disabled).toBe(true);

    unmount();
  });

  it("서버 확인 중에는 로딩 메시지와 함께 버튼을 비활성화한다", () => {
    useAuthSessionMock.mockReturnValue({
      data: null,
      isError: false,
      error: null,
      isPending: true,
      isFetching: false,
      isRefetching: false,
    });

    const { container, unmount } = render(
      <LoginContainer safeRedirect="/dashboard" />
    );

    const statusElement = container.querySelector('[role="status"]');
    expect(statusElement).not.toBeNull();
    expect(statusElement?.textContent).toContain("서버 확인 중 ...");
    const spinner = statusElement?.querySelector("span");
    expect(spinner).not.toBeNull();
    expect(spinner?.className).toContain("animate-spin");

    const button = container.querySelector(
      '[data-testid="github-login-button"]'
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    unmount();
  });

  it("로그인 진행 중에는 버튼에 스피너와 aria-busy 속성을 표시한다", () => {
    useGithubLoginMock.mockReturnValue({
      login: loginMock,
      isLoading: true,
      error: null,
    });

    const { container, unmount } = render(
      <LoginContainer safeRedirect="/dashboard" />
    );

    const button = container.querySelector(
      '[data-testid="github-login-button"]'
    ) as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    const spinner = button.querySelector('[aria-hidden="true"]');
    expect(spinner).not.toBeNull();
    expect(spinner?.className).toContain("animate-spin");

    unmount();
  });

  it("authError 파라미터가 전달되면 메시지를 표시하고 재시도 시 쿼리를 제거한다", async () => {
    const { container, unmount } = render(
      <LoginContainer
        safeRedirect="/logs"
        authErrorCode="AUTH_PROVIDER_DENIED"
      />
    );

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).not.toBeNull();
    expect(alertElement?.textContent).toBe(
      "GitHub 로그인 요청이 취소되었습니다. 다시 시도해주세요."
    );

    const button = container.querySelector(
      '[data-testid="github-login-button"]'
    ) as HTMLButtonElement;
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
    const [navigationArgs] = navigateMock.mock.calls;
    const navigateOptions = (navigationArgs?.[0] ?? {}) as {
      replace?: boolean;
      search?: (prev: { redirect?: string; authError?: string }) => {
        redirect?: string;
        authError?: string;
      };
    };
    expect(navigateOptions.replace).toBe(true);
    const updatedSearch = navigateOptions.search?.({
      redirect: "/logs",
      authError: "AUTH_PROVIDER_DENIED",
    });
    expect(updatedSearch).toEqual({ redirect: "/logs", authError: undefined });

    unmount();
  });
});
