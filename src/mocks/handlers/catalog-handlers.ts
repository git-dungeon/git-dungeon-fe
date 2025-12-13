import { http, HttpResponse } from "msw";
import { CATALOG_ENDPOINTS } from "@/shared/config/env";
import { respondWithSuccess } from "@/mocks/lib/api-response";

type CatalogLocale = "ko" | "en";

const ETAG_BY_LOCALE: Record<CatalogLocale, string> = {
  ko: '"catalog-ko-v1"',
  en: '"catalog-en-v1"',
};

function resolveLocale(url: URL): CatalogLocale {
  const locale = url.searchParams.get("locale");
  return locale === "ko" ? "ko" : "en";
}

function createCatalogResponsePayload(locale: CatalogLocale) {
  const now = new Date().toISOString();
  const etag = ETAG_BY_LOCALE[locale];

  return {
    etag,
    now,
    body: {
      version: 1,
      updatedAt: now,
      items: [],
      buffs: [],
      monsters: [],
      assetsBaseUrl: null,
      spriteMap: null,
    },
  };
}

export const catalogHandlers = [
  http.get(CATALOG_ENDPOINTS.catalog, ({ request }) => {
    const url = new URL(request.url);
    const locale = resolveLocale(url);
    const ifNoneMatch = request.headers.get("if-none-match");
    const { etag, now, body } = createCatalogResponsePayload(locale);

    if (ifNoneMatch && ifNoneMatch === etag) {
      return new HttpResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "no-store",
        },
      });
    }

    return respondWithSuccess(body, {
      headers: {
        ETag: etag,
        "Cache-Control": "no-store",
      },
      meta: {
        requestId: `req_catalog_${locale}`,
        generatedAt: now,
        etag,
      },
    });
  }),
];
