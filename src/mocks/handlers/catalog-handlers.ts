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
      enhancement: {
        maxLevel: 10,
        successRates: {
          "1": 1,
          "2": 0.95,
          "3": 0.9,
          "4": 0.85,
          "5": 0.8,
          "6": 0.7,
          "7": 0.6,
          "8": 0.45,
          "9": 0.3,
          "10": 0.15,
        },
        goldCosts: {
          "1": 5,
          "2": 10,
          "3": 20,
          "4": 35,
          "5": 55,
          "6": 80,
          "7": 110,
          "8": 145,
          "9": 185,
          "10": 230,
        },
        materialCounts: {
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4,
          "5": 5,
          "6": 6,
          "7": 7,
          "8": 8,
          "9": 9,
          "10": 10,
        },
        materialsBySlot: {
          weapon: "material-metal-scrap",
          armor: "material-cloth-scrap",
          helmet: "material-leather-scrap",
          ring: "material-mithril-dust",
        },
      },
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
