import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { RANKING_ENDPOINTS } from "@/shared/config/env";
import { getRanking } from "@/entities/ranking/api/get-ranking";
import * as httpClient from "@/shared/api/http-client";
import { createAppError } from "@/shared/errors/app-error";

const rankingPayload = {
  rankings: [
    {
      rank: 1,
      displayName: "PixelHero",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
      level: 25,
      maxFloor: 30,
    },
  ],
  nextCursor: null,
} as const;

describe("getRanking", () => {
  it("랭킹 목록을 스키마로 파싱한다", async () => {
    server.use(
      http.get(RANKING_ENDPOINTS.list, () => respondWithSuccess(rankingPayload))
    );

    await expect(getRanking()).resolves.toEqual(rankingPayload);
  });

  it("API 오류 응답 시 AppError를 던진다", async () => {
    server.use(
      http.get(RANKING_ENDPOINTS.list, () =>
        respondWithError("RANKING_INVALID_QUERY", {
          status: 400,
          code: "RANKING_INVALID_QUERY",
        })
      )
    );

    await expect(getRanking()).rejects.toMatchObject({
      name: "AppError",
    });
  });

  it("네트워크 오류 시 AppError로 전달한다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(
        createAppError("NETWORK_FAILED", "Network request failed")
      );

    await expect(getRanking()).rejects.toMatchObject({
      code: "NETWORK_FAILED",
    });

    requestWithSchemaSpy.mockRestore();
  });
});
