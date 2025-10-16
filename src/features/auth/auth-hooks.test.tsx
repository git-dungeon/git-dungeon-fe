import React, { StrictMode, act, type PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGithubLogin,
  GITHUB_POPUP_MESSAGE_CHANNEL,
} from "./github-login/model/use-github-login";
import { useLogout } from "./logout/model/use-logout";
import { AUTH_SESSION_QUERY_KEY } from "@/entities/auth/model/auth-session-query";
import { authStore } from "@/entities/auth/model/access-token-store";

const navigateMock = vi.fn();
const invalidateSessionMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useRouter: () => ({
    options: {
      context: { auth: { invalidateSession: invalidateSessionMock } },
    },
    navigate: navigateMock,
  }),
}));

vi.mock("@/shared/api/http-client", () => {
  return {
    httpRequest: vi.fn(),
  };
});

vi.mock("@/entities/auth/lib/auth-cookie", () => {
  return {
    writeAuthCookies: vi.fn(),
  };
});

vi.mock("@/shared/config/env", () => {
  return {
    AUTH_ENDPOINTS: {
      startGithubOAuth: "/auth/github",
      session: "/api/auth/session",
      logout: "/api/auth/logout",
    },
    get IS_MSW_ENABLED() {
      return true;
    },
    resolveApiUrl: vi.fn((path: string) => path),
  };
});

const httpClientModule = await import("@/shared/api/http-client");
const httpRequestMock = vi.mocked(httpClientModule.httpRequest);

const authCookieModule = await import("@/entities/auth/lib/auth-cookie");
const writeAuthCookiesMock = vi.mocked(authCookieModule.writeAuthCookies);

const envModule = await import("@/shared/config/env");
const resolveApiUrlMock = vi.mocked(envModule.resolveApiUrl);
const isMswEnabledMock = vi.spyOn(envModule, "IS_MSW_ENABLED", "get");

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

function renderWithQueryClient(ui: React.ReactElement, client: QueryClient) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
      </StrictMode>
    );
  });
  return {
    root,
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function renderGithubLoginHook(options?: Parameters<typeof useGithubLogin>[0]) {
  const queryClient = new QueryClient();
  let hookResult: ReturnType<typeof useGithubLogin>;

  function HookWrapper(props: PropsWithChildren<typeof options>) {
    hookResult = useGithubLogin(props);
    return null;
  }

  const mounted = renderWithQueryClient(
    <HookWrapper {...options} />,
    queryClient
  );

  return {
    get result() {
      return hookResult!;
    },
    queryClient,
    unmount: mounted.unmount,
  };
}

function createPopupMock() {
  const closeSpy = vi.fn();
  const focusSpy = vi.fn();
  const popupWindow = {
    closed: false,
    close: () => {
      closeSpy();
      popupWindow.closed = true;
    },
    focus: focusSpy,
  } as unknown as Window & {
    closed: boolean;
    close: () => void;
    focus: () => void;
  };

  return {
    window: popupWindow,
    close: closeSpy,
    focus: focusSpy,
  };
}

function renderLogoutHook() {
  const queryClient = new QueryClient();
  let hookResult: ReturnType<typeof useLogout>;

  function HookWrapper() {
    hookResult = useLogout();
    return null;
  }

  const mounted = renderWithQueryClient(<HookWrapper />, queryClient);

  return {
    get result() {
      return hookResult!;
    },
    unmount: mounted.unmount,
  };
}

describe("useGithubLogin", () => {
  beforeEach(() => {
    vi.useRealTimers();
    authStore.clear();
    httpRequestMock.mockReset();
    writeAuthCookiesMock.mockReset();
    navigateMock.mockReset();
    isMswEnabledMock.mockReturnValue(true);
    resolveApiUrlMock.mockReset();
    resolveApiUrlMock.mockImplementation((path: string) => path);
  });

  it("MSW 환경에서 팝업 성공 메시지를 처리한다", async () => {
    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);
    const session = { userId: "user-1", username: "tester" };

    const { result, queryClient, unmount } = renderGithubLoginHook({
      redirectTo: "/logs",
    });

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      const popupUrl = openSpy.mock.calls[0]?.[0] as string;
      expect(popupUrl).toContain("/mock-auth/github-popup.html");
      expect(popupUrl).toContain("redirect=%2Flogs");

      const message = new MessageEvent("message", {
        data: {
          type: GITHUB_POPUP_MESSAGE_CHANNEL,
          status: "success",
          payload: {
            session,
            accessToken: "token-123",
            redirect: "/logs",
          },
        },
        origin: window.location.origin,
        source: popup.window,
      });
      window.dispatchEvent(message);
      await loginPromise;
    });

    expect(queryClient.getQueryData(AUTH_SESSION_QUERY_KEY)).toEqual(session);
    expect(authStore.getAccessToken()).toBe("token-123");
    expect(writeAuthCookiesMock).toHaveBeenCalledWith(session);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/logs", replace: true });
    expect(popup.close).toHaveBeenCalled();
    expect(result.error).toBeNull();

    openSpy.mockRestore();
    unmount();
  });

  it("팝업 성공 후 네비게이션이 지연되어도 에러로 덮어쓰지 않는다", async () => {
    vi.useFakeTimers();
    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);

    let resolveNavigation: (() => void) | null = null;
    navigateMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveNavigation = resolve;
        })
    );

    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: GITHUB_POPUP_MESSAGE_CHANNEL,
            status: "success",
            payload: {
              session: { userId: "user-1", username: "tester" },
              accessToken: "token",
              redirect: "/dashboard",
            },
          },
          origin: window.location.origin,
          source: popup.window,
        })
      );

      vi.runOnlyPendingTimers();
      expect(resolveNavigation).not.toBeNull();
      resolveNavigation?.();
      await expect(loginPromise).resolves.toBeUndefined();
    });

    expect(result.error).toBeNull();

    vi.useRealTimers();
    openSpy.mockRestore();
    unmount();
  });

  it("팝업에서 오류 메시지를 수신하면 에러 상태를 노출한다", async () => {
    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);

    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: GITHUB_POPUP_MESSAGE_CHANNEL,
            status: "error",
            payload: { message: "denied" },
          },
          origin: window.location.origin,
          source: popup.window,
        })
      );
      await expect(loginPromise).rejects.toThrow("denied");
    });

    expect(authStore.getAccessToken()).toBeUndefined();

    openSpy.mockRestore();
    unmount();
  });

  it("MSW 비활성화 시 API 기반 팝업 URL을 구성하고 메시지를 허용한다", async () => {
    isMswEnabledMock.mockReturnValue(false);
    resolveApiUrlMock.mockImplementation((path: string) => {
      if (path === "/") {
        return "https://auth.example.com/";
      }
      if (path === "/auth/github") {
        return "https://auth.example.com/auth/github";
      }
      return path;
    });

    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);

    const { result, unmount } = renderGithubLoginHook({
      redirectTo: "/dashboard",
    });

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      const popupUrl = openSpy.mock.calls[0]?.[0] as string;
      const parsed = new URL(popupUrl);
      expect(parsed.origin).toBe("https://auth.example.com");
      expect(parsed.pathname).toBe("/auth/github");
      expect(parsed.searchParams.get("redirect")).toBe("/dashboard");
      expect(parsed.searchParams.get("popup")).toBe("1");
      expect(parsed.searchParams.get("parent")).toBe(window.location.origin);

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: GITHUB_POPUP_MESSAGE_CHANNEL,
            status: "cancelled",
          },
          origin: "https://auth.example.com",
          source: popup.window,
        })
      );
      await expect(loginPromise).rejects.toThrow("로그인을 취소했습니다.");
    });

    openSpy.mockRestore();
    unmount();
  });

  it("팝업이 차단되면 에러를 발생시킨다", async () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);
    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      await expect(result.login()).rejects.toThrow(
        "로그인 팝업이 차단되었습니다. 브라우저 설정을 확인하세요."
      );
    });

    openSpy.mockRestore();
    unmount();
  });

  it("팝업이 조기에 닫히면 취소 에러를 발생시킨다", async () => {
    vi.useFakeTimers();
    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);

    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      popup.window.closed = true;
      vi.runOnlyPendingTimers();
      await expect(loginPromise).rejects.toThrow("로그인을 취소했습니다.");
    });

    vi.useRealTimers();
    openSpy.mockRestore();
    unmount();
  });

  it("팝업 응답이 지연되면 타임아웃 에러를 발생시킨다", async () => {
    vi.useFakeTimers();
    const popup = createPopupMock();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(popup.window);

    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      const loginPromise = result.login();
      await Promise.resolve();
      vi.advanceTimersByTime(60_000);
      await expect(loginPromise).rejects.toThrow(
        "로그인 응답이 지연되어 취소되었습니다. 잠시 후 다시 시도하세요."
      );
    });

    vi.useRealTimers();
    openSpy.mockRestore();
    unmount();
  });
});

describe("useLogout", () => {
  beforeEach(() => {
    httpRequestMock.mockReset();
    navigateMock.mockReset();
    invalidateSessionMock.mockReset();
  });

  it("로그아웃 성공 시 세션을 무효화하고 로그인 페이지로 이동한다", async () => {
    httpRequestMock.mockResolvedValue({ success: true });

    const { result, unmount } = renderLogoutHook();

    await act(async () => {
      await result.mutateAsync();
    });

    expect(httpRequestMock).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      parseAs: "json",
    });
    expect(invalidateSessionMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/login" });

    unmount();
  });

  it("로그아웃 실패 시 세션/네비게이션을 건드리지 않는다", async () => {
    httpRequestMock.mockRejectedValue(new Error("network error"));

    const { result, unmount } = renderLogoutHook();

    await act(async () => {
      await expect(result.mutateAsync()).rejects.toThrow("network error");
    });

    expect(invalidateSessionMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();

    unmount();
  });
});
