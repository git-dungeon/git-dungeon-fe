import { beforeEach, describe, expect, it, vi } from "vitest";
import type { QueryClient } from "@tanstack/react-query";
import { createAuthService } from "./auth-service";
import { AUTH_SESSION_QUERY_KEY } from "../model/auth-session-query";
import { authStore } from "../model/access-token-store";
import type { AuthSession } from "../model/types";

function createMockQueryClient() {
  return {
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn().mockResolvedValue(undefined),
    ensureQueryData: vi.fn().mockResolvedValue(null),
  } as unknown as QueryClient;
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
});
