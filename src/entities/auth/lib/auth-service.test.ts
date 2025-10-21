import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ParsedLocation } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { createAuthService } from "./auth-service";
import { AUTH_SESSION_QUERY_KEY } from "../model/auth-session-query";
import { authStore } from "../model/access-token-store";
import type { AuthSession } from "../model/types";
import { NetworkError } from "@/shared/api/http-client";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    redirect: (options: unknown) => {
      return Object.assign(new Error("redirect"), { __redirect: options });
    },
  };
});

function createMockQueryClient() {
  return {
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn().mockResolvedValue(undefined),
    ensureQueryData: vi.fn().mockResolvedValue(null),
  } as unknown as QueryClient;
}

function createLocation(pathname = "/dashboard"): ParsedLocation {
  return {
    pathname,
    path: pathname,
    href: pathname,
    search: {},
    searchStr: "",
    hash: "",
    state: undefined,
    key: "test",
  } as unknown as ParsedLocation;
}

describe("createAuthService", () => {
  beforeEach(() => {
    authStore.clear();
  });

  it("setSession(null)을 호출하면 메모리 액세스 토큰을 초기화한다", () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);

    const sampleSession: AuthSession = {
      userId: "123",
      username: "tester",
    };

    authStore.setAccessToken("existing-token");

    service.setSession(sampleSession);
    expect(authStore.getAccessToken()).toBe("existing-token");

    service.setSession(null);

    expect(queryClient.setQueryData).toHaveBeenLastCalledWith(
      AUTH_SESSION_QUERY_KEY,
      null
    );
    expect(authStore.getAccessToken()).toBeUndefined();
  });

  it("invalidateSession은 쿼리 캐시와 액세스 토큰을 모두 정리한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);

    authStore.setAccessToken("session-token");

    await service.invalidateSession();

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      AUTH_SESSION_QUERY_KEY,
      null
    );
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: AUTH_SESSION_QUERY_KEY,
    });
    expect(authStore.getAccessToken()).toBeUndefined();
  });

  it("authorize는 세션이 없으면 로그인 경로로 redirect 오류를 던진다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockResolvedValue(null);

    const location = createLocation("/inventory?tab=1");

    await expect(
      service.authorize({ location, redirectTo: "/logs" })
    ).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({
        to: "/login",
      }),
    });
  });

  it("authorize는 세션이 있으면 세션 객체를 반환한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    const session: AuthSession = {
      userId: "user-1",
      username: "tester",
    };
    queryClient.ensureQueryData = vi.fn().mockResolvedValue(session);

    await expect(
      service.authorize({ location: createLocation("/dashboard") })
    ).resolves.toEqual(session);
  });

  it("redirectIfAuthenticated는 세션이 있으면 대상 경로로 redirect 오류를 던진다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockResolvedValue({
      userId: "user-1",
      username: "tester",
    } satisfies AuthSession);

    await expect(
      service.redirectIfAuthenticated({
        location: createLocation("/login"),
        redirectTo: "/dashboard",
      })
    ).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({
        to: "/dashboard",
      }),
    });
  });

  it("redirectIfAuthenticated는 세션이 없으면 아무 것도 하지 않는다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockResolvedValue(null);

    await expect(
      service.redirectIfAuthenticated({
        location: createLocation("/login"),
        redirectTo: "/dashboard",
      })
    ).resolves.toBeUndefined();
  });

  it("authorize는 네트워크 오류 발생 시 세션 없음으로 처리한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockRejectedValue(new NetworkError());

    await expect(
      service.authorize({
        location: createLocation("/protected"),
        redirectTo: "/logs",
      })
    ).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({ to: "/login" }),
    });
  });

  it("authorize는 세션 API 오류 발생 시 로그인 경로로 redirect하고 액세스 토큰을 초기화한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

    authStore.setAccessToken("server-token");

    await expect(
      service.authorize({
        location: createLocation("/protected"),
        redirectTo: "/logs",
      })
    ).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({ to: "/login" }),
    });

    expect(authStore.getAccessToken()).toBeUndefined();
  });

  it("redirectIfAuthenticated는 네트워크 오류 발생 시 에러 없이 종료한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockRejectedValue(new NetworkError());

    await expect(
      service.redirectIfAuthenticated({
        location: createLocation("/login"),
        redirectTo: "/dashboard",
      })
    ).resolves.toBeUndefined();
  });

  it("redirectIfAuthenticated는 세션 API 오류 발생 시 에러 없이 종료한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

    await expect(
      service.redirectIfAuthenticated({
        location: createLocation("/login"),
        redirectTo: "/dashboard",
      })
    ).resolves.toBeUndefined();
  });
});
