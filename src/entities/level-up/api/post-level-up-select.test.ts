import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { LEVEL_UP_ENDPOINTS } from "@/shared/config/env";
import { postLevelUpSelect } from "@/entities/level-up/api/post-level-up-select";
import * as httpClient from "@/shared/api/http-client";
import { createAppError } from "@/shared/errors/app-error";

const applyPayload = {
  stat: "atk",
  rollIndex: 0,
} as const;

const applyResponse = {
  points: 1,
  rollIndex: 1,
  applied: { stat: "atk", rarity: "rare", value: 3 },
  stats: {
    hp: 32,
    maxHp: 40,
    atk: 21,
    def: 14,
    luck: 6,
  },
} as const;

describe("postLevelUpSelect", () => {
  it("선택 결과를 스키마로 파싱한다", async () => {
    server.use(
      http.post(LEVEL_UP_ENDPOINTS.apply, () =>
        respondWithSuccess(applyResponse)
      )
    );

    await expect(postLevelUpSelect(applyPayload)).resolves.toEqual(
      applyResponse
    );
  });

  it("잘못된 요청 payload는 즉시 실패한다", async () => {
    await expect(
      postLevelUpSelect({
        stat: "invalid",
        rollIndex: 0,
      } as never)
    ).rejects.toBeDefined();
  });

  it("API 오류 응답 시 AppError를 던진다", async () => {
    server.use(
      http.post(LEVEL_UP_ENDPOINTS.apply, () =>
        respondWithError("LEVEL_UP_INVALID_STATE", {
          status: 409,
          code: "LEVEL_UP_INVALID_STATE",
        })
      )
    );

    await expect(postLevelUpSelect(applyPayload)).rejects.toMatchObject({
      name: "AppError",
    });
  });

  it("네트워크 오류 시 AppError로 전달한다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(
        createAppError("NETWORK_FAILED", "Network request failed")
      );

    await expect(postLevelUpSelect(applyPayload)).rejects.toMatchObject({
      code: "NETWORK_FAILED",
    });

    requestWithSchemaSpy.mockRestore();
  });
});
