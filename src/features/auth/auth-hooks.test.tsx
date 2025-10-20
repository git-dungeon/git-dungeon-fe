import React, { StrictMode, act, type PropsWithChildren } from "react";
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
import { useGithubLogin } from "./github-login/model/use-github-login";
import { useLogout } from "./logout/model/use-logout";

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

vi.mock("@/shared/config/env", () => {
  return {
    AUTH_ENDPOINTS: {
      startGithubOAuth: "/auth/github",
      session: "/api/auth/session",
      logout: "/api/auth/logout",
    },
    IS_MSW_ENABLED: false,
    resolveApiUrl: vi.fn((path: string) => path),
  };
});

const httpClientModule = await import("@/shared/api/http-client");
const httpRequestMock = vi.mocked(httpClientModule.httpRequest);

const envModule = await import("@/shared/config/env");
const resolveApiUrlMock = vi.mocked(envModule.resolveApiUrl);

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
  const originalLocation = window.location;
  let locationAssignMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useRealTimers();
    httpRequestMock.mockReset();
    resolveApiUrlMock.mockReset();
    resolveApiUrlMock.mockImplementation((path: string) => path);
    locationAssignMock = vi.fn();
    const mockedLocation = {
      assign: locationAssignMock,
      origin: originalLocation.origin,
      href: originalLocation.href,
    } as unknown as Location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: mockedLocation,
    });
  });

  afterEach(() => {
    if (window.location !== originalLocation) {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
    }
  });

  it("OAuth 엔드포인트로 리다이렉트하며 redirect 파라미터를 포함한다", async () => {
    const { result, unmount } = renderGithubLoginHook({
      redirectTo: "/logs",
    });

    await act(async () => {
      await result.login();
    });

    expect(locationAssignMock).toHaveBeenCalledWith(
      `${originalLocation.origin}/auth/github?redirect=${encodeURIComponent("/logs")}`
    );

    unmount();
  });

  it("위험한 redirect 값을 기본 대시보드로 대체한다", async () => {
    const { result, unmount } = renderGithubLoginHook({
      redirectTo: "https://malicious.example.com/callback",
    });

    await act(async () => {
      await result.login();
    });

    expect(locationAssignMock).toHaveBeenCalledWith(
      `${originalLocation.origin}/auth/github?redirect=${encodeURIComponent("/dashboard")}`
    );

    unmount();
  });

  it("절대 경로를 반환하는 resolveApiUrl 결과를 그대로 사용한다", async () => {
    resolveApiUrlMock.mockImplementation((path: string) => {
      if (path === "/auth/github") {
        return "https://auth.example.com/oauth/github";
      }
      return path;
    });

    const { result, unmount } = renderGithubLoginHook({
      redirectTo: "/inventory",
    });

    await act(async () => {
      await result.login();
    });

    expect(locationAssignMock).toHaveBeenCalledWith(
      `https://auth.example.com/oauth/github?redirect=${encodeURIComponent("/inventory")}`
    );

    unmount();
  });

  it("브라우저 환경이 아니면 에러를 발생시키고 상태를 복원한다", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, "location", {
      configurable: true,
      value: undefined,
    });

    const { result, unmount } = renderGithubLoginHook();

    let caught: unknown;
    await act(async () => {
      try {
        await result.login();
      } catch (error) {
        caught = error;
      }
    });

    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe(
      "로그인을 진행하려면 브라우저 환경이 필요합니다."
    );
    expect(result.isLoading).toBe(false);

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
