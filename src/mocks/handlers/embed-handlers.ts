import { http, HttpResponse } from "msw";
import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { buildInventoryResponse } from "@/mocks/handlers/inventory-handlers";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import {
  EMBED_PREVIEW_SIZE_VALUES,
  type EmbedPreviewSize,
} from "@/entities/embed/model/types";

const EMBED_PREVIEW_SIZE_SET = new Set<EmbedPreviewSize>(
  EMBED_PREVIEW_SIZE_VALUES
);

function resolveEmbedPreviewSize(rawSize: string | null) {
  if (rawSize && EMBED_PREVIEW_SIZE_SET.has(rawSize as EmbedPreviewSize)) {
    return rawSize as EmbedPreviewSize;
  }
  return "wide";
}

function buildMockSvg(userId: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120"><rect width="480" height="120" fill="#1f2937"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f9fafb" font-size="16" font-family="Inter, Arial, sans-serif">${userId}</text></svg>`;
}

export const embedHandlers = [
  http.get(EMBEDDING_ENDPOINTS.preview, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return respondWithError("userId query parameter is required", {
        status: 400,
        code: "EMBED_USER_ID_REQUIRED",
      });
    }

    const dashboard = JSON.parse(JSON.stringify(mockDashboardResponse));
    const inventory = buildInventoryResponse();
    const theme = url.searchParams.get("theme") ?? "dark";
    const size = resolveEmbedPreviewSize(url.searchParams.get("size"));
    const language = url.searchParams.get("language") ?? "ko";

    return respondWithSuccess({
      theme,
      size,
      language,
      generatedAt: new Date().toISOString(),
      dashboard,
      inventory,
    });
  }),
  http.get(EMBEDDING_ENDPOINTS.previewSvg, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return respondWithError("userId query parameter is required", {
        status: 400,
        code: "EMBED_USER_ID_REQUIRED",
      });
    }

    const svg = buildMockSvg(userId);

    return new HttpResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  }),
];
