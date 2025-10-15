import { http } from "msw";
import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { buildInventoryResponse } from "@/mocks/handlers/inventory-handlers";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";

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
    const size = url.searchParams.get("size") ?? "wide";
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
];
