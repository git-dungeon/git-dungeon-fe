import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/tests/server";
import { CATALOG_ENDPOINTS } from "@/shared/config/env";
import { respondWithSuccess } from "@/mocks/lib/api-response";
import { NetworkError } from "@/shared/api/http-client";
import { getCatalog } from "./get-catalog";

describe("getCatalog", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("ETag를 저장하고 304 응답 시 캐시 데이터를 반환한다", async () => {
    const etag = '"catalog-en-v1"';
    const now = new Date().toISOString();
    const catalogData = {
      version: 1,
      updatedAt: now,
      items: [],
      buffs: [],
      monsters: [],
      assetsBaseUrl: null,
      spriteMap: null,
    };

    let seenIfNoneMatch: string | null = null;

    server.use(
      http.get(CATALOG_ENDPOINTS.catalog, ({ request }) => {
        const inm = request.headers.get("if-none-match");
        if (inm) {
          seenIfNoneMatch = inm;
          return new HttpResponse(null, {
            status: 304,
            headers: { ETag: etag },
          });
        }

        return respondWithSuccess(catalogData, {
          headers: { ETag: etag },
          meta: { generatedAt: now, etag },
        });
      })
    );

    const first = await getCatalog({ locale: "en" });
    const second = await getCatalog({ locale: "en" });

    expect(first).toEqual(catalogData);
    expect(second).toEqual(catalogData);
    expect(seenIfNoneMatch).toBe(etag);
  });

  it("304이지만 캐시 데이터가 없으면 If-None-Match 없이 재요청한다", async () => {
    const etag = '"catalog-en-v1"';
    const now = new Date().toISOString();
    const catalogData = {
      version: 1,
      updatedAt: now,
      items: [],
      buffs: [],
      monsters: [],
      assetsBaseUrl: null,
      spriteMap: null,
    };

    window.localStorage.setItem(
      "git-dungeon:catalog:en",
      JSON.stringify({ etag, data: null })
    );

    let requestCount = 0;

    server.use(
      http.get(CATALOG_ENDPOINTS.catalog, ({ request }) => {
        requestCount += 1;
        const inm = request.headers.get("if-none-match");
        if (inm) {
          return new HttpResponse(null, {
            status: 304,
            headers: { ETag: etag },
          });
        }

        return respondWithSuccess(catalogData, {
          headers: { ETag: etag },
          meta: { generatedAt: now, etag },
        });
      })
    );

    const resolved = await getCatalog({ locale: "en" });

    expect(resolved).toEqual(catalogData);
    expect(requestCount).toBe(2);
  });

  it("네트워크 오류는 NetworkError로 처리한다", async () => {
    server.use(
      http.get(CATALOG_ENDPOINTS.catalog, () => {
        return HttpResponse.error();
      })
    );

    await expect(getCatalog({ locale: "en" })).rejects.toBeInstanceOf(
      NetworkError
    );
  });
});
