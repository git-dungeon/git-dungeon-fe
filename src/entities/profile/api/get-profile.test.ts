import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { SETTINGS_ENDPOINTS } from "@/shared/config/env";
import { getProfile } from "@/entities/profile/api/get-profile";
import * as httpClient from "@/shared/api/http-client";
import { ApiError, NetworkError } from "@/shared/api/http-client";
import { DEFAULT_USER_ID } from "@/mocks/fixtures/profile-overview";

describe("getProfile", () => {
  it("기본 MSW 핸들러 응답을 스키마로 파싱한다", async () => {
    const data = await getProfile();

    expect(data.profile.userId).toBe(DEFAULT_USER_ID);
    expect(data.connections.github?.connected).toBe(true);
  });

  it("프로필 오버뷰를 반환한다", async () => {
    const payload = {
      profile: {
        userId: "test-user",
        username: "tester",
        displayName: "Test User",
        email: "tester@example.com",
        avatarUrl: "https://example.com/avatar.png",
        joinedAt: "2025-10-21T00:00:00.000Z",
      },
      connections: {
        github: {
          connected: true,
          lastSyncAt: "2025-10-21T01:00:00.000Z",
        },
      },
    } as const;

    server.use(
      http.get(SETTINGS_ENDPOINTS.profile, () => respondWithSuccess(payload))
    );

    await expect(getProfile()).resolves.toEqual(payload);
  });

  it("API 오류 응답 시 ApiError를 던진다", async () => {
    server.use(
      http.get(SETTINGS_ENDPOINTS.profile, () =>
        respondWithError("PROFILE_UNAUTHORIZED", {
          status: 200,
          code: "SETTINGS_PROFILE_UNAUTHORIZED",
        })
      )
    );

    await expect(getProfile()).rejects.toBeInstanceOf(ApiError);
  });

  it("네트워크 오류 시 NetworkError를 그대로 전달한다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(new NetworkError());

    await expect(getProfile()).rejects.toBeInstanceOf(NetworkError);

    requestWithSchemaSpy.mockRestore();
  });
});
