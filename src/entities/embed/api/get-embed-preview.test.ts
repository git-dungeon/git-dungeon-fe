import { http } from "msw";
import { describe, expect, it } from "vitest";
import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { getEmbedPreview } from "@/entities/embed/api/get-embed-preview";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { server } from "@/mocks/tests/server";
import { ApiError } from "@/shared/api/http-client";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { buildInventoryResponse } from "@/mocks/handlers/inventory-handlers";

const previewUrl = new URL(
  EMBEDDING_ENDPOINTS.preview,
  "http://localhost"
).toString();

const baseParams = {
  userId: "user-123",
  theme: "dark",
  size: "wide",
  language: "ko",
} as const;

describe("getEmbedPreview", () => {
  it("요청 성공 시 임베드 미리보기 데이터를 반환한다", async () => {
    server.use(
      http.get(previewUrl, () =>
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

  it("서버가 실패 응답을 반환하면 ApiError를 던진다", async () => {
    server.use(
      http.get(previewUrl, () =>
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
      const embedError = error as ApiError;

      expect(embedError).toMatchObject({
        name: "EmbedApiError",
        status: 500,
      });
      expect(embedError.payload).toMatchObject({
        error: {
          message: "Preview failed",
          code: "EMBED_PREVIEW_FAILED",
        },
      });
    }
  });
});
