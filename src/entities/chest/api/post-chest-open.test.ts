import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { CHEST_ENDPOINTS } from "@/shared/config/env";
import { postChestOpen } from "@/entities/chest/api/post-chest-open";
import * as httpClient from "@/shared/api/http-client";
import { createAppError } from "@/shared/errors/app-error";

const chestOpenResponse = {
  remainingChests: 1,
  rollIndex: 0,
  items: [
    {
      itemId: "reward-weapon-wooden-sword",
      code: "weapon-wooden-sword",
      slot: "weapon",
      rarity: "common",
      quantity: 1,
    },
  ],
} as const;

describe("postChestOpen", () => {
  it("상자 열기 응답을 스키마로 파싱한다", async () => {
    server.use(
      http.post(CHEST_ENDPOINTS.open, () =>
        respondWithSuccess(chestOpenResponse)
      )
    );

    await expect(postChestOpen()).resolves.toEqual(chestOpenResponse);
  });

  it("API 오류 응답 시 AppError를 던진다", async () => {
    server.use(
      http.post(CHEST_ENDPOINTS.open, () =>
        respondWithError("CHEST_EMPTY", {
          status: 409,
          code: "CHEST_EMPTY",
        })
      )
    );

    await expect(postChestOpen()).rejects.toMatchObject({
      name: "AppError",
    });
  });

  it("네트워크 오류 시 AppError로 전달한다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(
        createAppError("NETWORK_FAILED", "Network request failed")
      );

    await expect(postChestOpen()).rejects.toMatchObject({
      code: "NETWORK_FAILED",
    });

    requestWithSchemaSpy.mockRestore();
  });
});
