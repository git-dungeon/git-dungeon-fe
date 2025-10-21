import { describe, expect, it, vi } from "vitest";
import type { ParsedLocation } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { createAuthService } from "./auth-service";
import { AUTH_SESSION_QUERY_KEY } from "../model/auth-session-query";
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

function createLocation(
  pathname = "/dashboard",
  searchStr?: string
): ParsedLocation {
  let actualPath = pathname;
  let actualSearchStr = searchStr ?? "";

  if (!searchStr && pathname.includes("?")) {
    const [pathPart, queryPart] = pathname.split("?");
    actualPath = pathPart;
    actualSearchStr = queryPart ? `?${queryPart}` : "";
  }

  return {
    pathname: actualPath,
    path: actualPath,
    href: `${actualPath}${actualSearchStr}`,
    search: {},
    searchStr: actualSearchStr,
    hash: "",
    state: undefined,
    key: "test",
  } as unknown as ParsedLocation;
}

describe("createAuthService", () => {
  it("setSession은 세션 값을 쿼리 캐시에 저장하고 해제한다", () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);

    const sampleSession: AuthSession = {
      userId: "123",
      username: "tester",
      email: "tester@example.com",
    };

    service.setSession(sampleSession);
    expect(queryClient.setQueryData).toHaveBeenNthCalledWith(
      1,
      AUTH_SESSION_QUERY_KEY,
      sampleSession
    );

    service.setSession(null);

    expect(queryClient.setQueryData).toHaveBeenNthCalledWith(
      2,
      AUTH_SESSION_QUERY_KEY,
      null
    );
  });

  it("invalidateSession은 쿼리 캐시를 무효화한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);

    await service.invalidateSession();

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      AUTH_SESSION_QUERY_KEY,
      null
    );
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: AUTH_SESSION_QUERY_KEY,
    });
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

  it("authorize는 authError가 존재하면 로그인 경로로 redirect하며 코드와 redirect 정보를 전달한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    const location = createLocation(
      "/dashboard",
      "?authError=AUTH_PROVIDER_DENIED&view=latest"
    );

    await expect(service.authorize({ location })).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({
        to: "/login",
        search: {
          redirect: "/dashboard?view=latest",
          authError: "AUTH_PROVIDER_DENIED",
        },
      }),
    });

    expect(queryClient.ensureQueryData).not.toHaveBeenCalled();
  });

  it("authorize는 세션이 있으면 세션 객체를 반환한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    const session: AuthSession = {
      userId: "user-1",
      username: "tester",
      email: "tester@example.com",
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
      email: "tester@example.com",
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

  it("redirectIfAuthenticated는 authError 쿼리를 제거한 뒤 리다이렉트한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi.fn().mockResolvedValue({
      userId: "user-1",
      username: "tester",
      email: "tester@example.com",
    } satisfies AuthSession);

    await expect(
      service.redirectIfAuthenticated({
        location: createLocation(
          "/dashboard",
          "?authError=AUTH_PROVIDER_ERROR&view=latest"
        ),
      })
    ).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({ to: "/dashboard?view=latest" }),
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

  it("authorize는 세션 API 오류 발생 시 로그인 경로로 redirect한다", async () => {
    const queryClient = createMockQueryClient();
    const service = createAuthService(queryClient);
    queryClient.ensureQueryData = vi
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

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
