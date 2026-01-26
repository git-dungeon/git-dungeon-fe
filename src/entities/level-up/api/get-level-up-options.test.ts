import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { LEVEL_UP_ENDPOINTS } from "@/shared/config/env";
import { getLevelUpOptions } from "@/entities/level-up/api/get-level-up-options";
import * as httpClient from "@/shared/api/http-client";
import { createAppError } from "@/shared/errors/app-error";

const selectionPayload = {
  points: 2,
  rollIndex: 0,
  options: [
    { stat: "atk", rarity: "rare", value: 3 },
    { stat: "hp", rarity: "common", value: 1 },
    { stat: "def", rarity: "uncommon", value: 2 },
  ],
} as const;

describe("getLevelUpOptions", () => {
  it("레벨업 선택지를 스키마로 파싱한다", async () => {
    server.use(
      http.get(LEVEL_UP_ENDPOINTS.selection, () =>
        respondWithSuccess(selectionPayload)
      )
    );

    await expect(getLevelUpOptions()).resolves.toEqual(selectionPayload);
  });

  it("API 오류 응답 시 AppError를 던진다", async () => {
    server.use(
      http.get(LEVEL_UP_ENDPOINTS.selection, () =>
        respondWithError("LEVEL_UP_INVALID_STATE", {
          status: 400,
          code: "LEVEL_UP_INVALID_STATE",
        })
      )
    );

    await expect(getLevelUpOptions()).rejects.toMatchObject({
      name: "AppError",
    });
  });

  it("네트워크 오류 시 AppError로 전달한다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(
        createAppError("NETWORK_FAILED", "Network request failed")
      );

    await expect(getLevelUpOptions()).rejects.toMatchObject({
      code: "NETWORK_FAILED",
    });

    requestWithSchemaSpy.mockRestore();
  });
});
