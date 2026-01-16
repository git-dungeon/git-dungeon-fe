import { http } from "msw";
import { describe, expect, it } from "vitest";
import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { getEmbedPreview } from "@/entities/embed/api/get-embed-preview";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { server } from "@/mocks/tests/server";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { buildInventoryResponse } from "@/mocks/handlers/inventory-handlers";
import { isAppError } from "@/shared/errors/app-error";

const baseParams = {
  userId: "user-123",
  theme: "dark",
  size: "wide",
  language: "ko",
} as const;

describe("getEmbedPreview", () => {
  it("요청 성공 시 임베드 미리보기 데이터를 반환한다", async () => {
    server.use(
      http.get(EMBEDDING_ENDPOINTS.preview, () =>
        respondWithSuccess({
          theme: baseParams.theme,
          size: baseParams.size,
          language: baseParams.language,
          generatedAt: "2025-01-01T00:00:00.000Z",
          dashboard: mockDashboardResponse,
          inventory: buildInventoryResponse(),
        })
      )
    );

    const preview = await getEmbedPreview({ ...baseParams });

    expect(preview.userId).toBe(baseParams.userId);
    expect(preview.theme).toBe(baseParams.theme);
    expect(preview.size).toBe(baseParams.size);
    expect(preview.language).toBe(baseParams.language);
    expect(preview.dashboard.state).toBeDefined();
    expect(preview.inventory.items.length).toBeGreaterThan(0);
  });

  it("compact 사이즈 요청도 정상 처리된다", async () => {
    server.use(
      http.get(EMBEDDING_ENDPOINTS.preview, () =>
        respondWithSuccess({
          theme: baseParams.theme,
          size: "compact",
          language: baseParams.language,
          generatedAt: "2025-01-01T00:00:00.000Z",
          dashboard: mockDashboardResponse,
          inventory: buildInventoryResponse(),
        })
      )
    );

    const preview = await getEmbedPreview({ ...baseParams, size: "compact" });

    expect(preview.size).toBe("compact");
  });

  it("서버가 실패 응답을 반환하면 AppError를 던진다", async () => {
    server.use(
      http.get(EMBEDDING_ENDPOINTS.preview, () =>
        respondWithError("Preview failed", {
          status: 500,
          code: "EMBED_PREVIEW_FAILED",
        })
      )
    );

    try {
      await getEmbedPreview({ ...baseParams });
      throw new Error("Expected getEmbedPreview to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);

      if (isAppError(error)) {
        expect(error.code).toBe("API_SERVER");
        expect(error.meta?.status).toBe(500);
      }
    }
  });
});
