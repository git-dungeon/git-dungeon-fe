import { http, HttpResponse } from "msw";
import { EMBEDDING_ENDPOINTS } from "@/shared/config/env";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { buildInventoryResponse } from "@/mocks/handlers/inventory-handlers";

export const embedHandlers = [
  http.get(EMBEDDING_ENDPOINTS.preview, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "userId query parameter is required",
            code: "EMBED_USER_ID_REQUIRED",
          },
        },
        { status: 400 }
      );
    }

    const dashboard = JSON.parse(JSON.stringify(mockDashboardResponse));
    const inventory = buildInventoryResponse();

    return HttpResponse.json({
      success: true,
      data: {
        theme: url.searchParams.get("theme") ?? "dark",
        generatedAt: new Date().toISOString(),
        dashboard,
        inventory,
      },
    });
  }),
];
