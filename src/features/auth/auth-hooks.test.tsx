import React, { StrictMode, act, type PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGithubLogin } from "./github-login/model/use-github-login";
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
    authStore.clear();
    httpRequestMock.mockReset();
    writeAuthCookiesMock.mockReset();
    navigateMock.mockReset();
    isMswEnabledMock.mockReturnValue(true);
    resolveApiUrlMock.mockReset();
    resolveApiUrlMock.mockImplementation((path: string) => path);
  });

  it("MSW 환경에서 로그인 성공 시 세션/토큰을 저장하고 이동한다", async () => {
    const session = { userId: "user-1", username: "tester" };
    httpRequestMock.mockResolvedValue({
      session,
      accessToken: "token-123",
    });

    const { result, queryClient, unmount } = renderGithubLoginHook({
      redirectTo: "/logs",
    });

    await act(async () => {
      await result.login();
    });

    expect(httpRequestMock).toHaveBeenCalledWith("/auth/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ redirect: "/logs" }),
    });
    expect(queryClient.getQueryData(AUTH_SESSION_QUERY_KEY)).toEqual(session);
    expect(authStore.getAccessToken()).toBe("token-123");
    expect(writeAuthCookiesMock).toHaveBeenCalledWith(session);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/logs", replace: true });

    unmount();
  });

  it("MSW 환경에서 오류가 발생하면 에러 상태를 노출한다", async () => {
    httpRequestMock.mockRejectedValue(new Error("network"));

    const { result, unmount } = renderGithubLoginHook();

    await act(async () => {
      await expect(result.login()).rejects.toThrow("network");
    });
    expect(writeAuthCookiesMock).not.toHaveBeenCalled();
    expect(authStore.getAccessToken()).toBeUndefined();
    unmount();
  });

  it("MSW 비활성화 시 리다이렉트 URL을 구성한다", async () => {
    isMswEnabledMock.mockReturnValue(false);
    resolveApiUrlMock.mockImplementation(() => "https://auth.example.com");
    const originalLocation = window.location;
    const locationMock = { href: "http://localhost" } as Location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: locationMock,
    });

    const { result, unmount } = renderGithubLoginHook({
      redirectTo: "/logs",
    });

    await act(async () => {
      await result.login();
    });

    expect(resolveApiUrlMock).toHaveBeenCalledWith("/auth/github");
    expect(window.location.href).toBe(
      "https://auth.example.com/?redirect=%2Flogs"
    );

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
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
