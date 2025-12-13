import { CATALOG_ENDPOINTS } from "@/shared/config/env";
import { ApiError, NetworkError, apiClient } from "@/shared/api/http-client";
import {
  createApiResponseSchema,
  formatZodError,
  type ApiResponse,
} from "@/shared/api/api-response";
import { catalogDataSchema, type CatalogData } from "../model/types";

export interface GetCatalogParams {
  locale?: "ko" | "en";
}

interface CatalogCacheShape {
  etag: string | null;
  data: CatalogData | null;
}

const STORAGE_PREFIX = "git-dungeon:catalog";

function resolveStorageKey(locale?: string) {
  return `${STORAGE_PREFIX}:${locale ?? "default"}`;
}

function isBrowserEnvironment(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readCache(locale?: string): CatalogCacheShape | null {
  if (!isBrowserEnvironment()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(resolveStorageKey(locale));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<CatalogCacheShape>;
    const storedData = parsed.data ?? null;
    const validatedData =
      storedData && catalogDataSchema.safeParse(storedData).success
        ? (storedData as CatalogData)
        : null;

    return {
      etag: typeof parsed.etag === "string" ? parsed.etag : null,
      data: validatedData,
    };
  } catch {
    return null;
  }
}

function writeCache(locale: string | undefined, next: CatalogCacheShape): void {
  if (!isBrowserEnvironment()) {
    return;
  }

  try {
    window.localStorage.setItem(
      resolveStorageKey(locale),
      JSON.stringify(next)
    );
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

function clearCache(locale?: string): void {
  if (!isBrowserEnvironment()) {
    return;
  }

  try {
    window.localStorage.removeItem(resolveStorageKey(locale));
  } catch {
    // ignore remove failures
  }
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const clone = response.clone();
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      const preview = await clone.text().catch(() => "");
      const context = preview ? { error, preview } : error;
      throw new NetworkError(
        "API 응답이 JSON 형식이 아닙니다. 백엔드 URL 또는 프록시 설정을 확인하세요.",
        context
      );
    }
    throw error;
  }
}

function extractEtag(response: Response, body?: unknown): string | null {
  const headerEtag = response.headers.get("etag");
  if (headerEtag) {
    return headerEtag;
  }

  const meta = (body as { meta?: unknown } | null | undefined)?.meta;
  if (meta && typeof meta === "object") {
    const etag = (meta as { etag?: unknown }).etag;
    return typeof etag === "string" ? etag : null;
  }

  return null;
}

function parseCatalogResponse(body: unknown): CatalogData {
  const responseSchema = createApiResponseSchema(catalogDataSchema);
  const parsed = responseSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(
      "API 응답 스키마가 올바르지 않습니다.",
      422,
      formatZodError(parsed.error)
    );
  }

  const response = parsed.data as ApiResponse<CatalogData>;

  if (!response.success) {
    const errorPayload = response.error;
    throw new ApiError(errorPayload.message, 200, {
      error: errorPayload,
      meta: response.meta,
    });
  }

  return response.data;
}

async function fetchCatalogFromServer(
  params: GetCatalogParams,
  etag: string | null
): Promise<{ data: CatalogData; etag: string | null; raw: unknown }> {
  const requestPath = CATALOG_ENDPOINTS.catalog.replace(/^\//, "");
  const response = await apiClient(requestPath, {
    method: "GET",
    throwHttpErrors: false,
    headers: etag ? { "If-None-Match": etag } : undefined,
    searchParams: params.locale ? { locale: params.locale } : undefined,
  });

  if (response.status === 304) {
    throw new ApiError("Not Modified", 304, null);
  }

  if (!response.ok) {
    const payload = await response
      .clone()
      .json()
      .catch(async () => {
        try {
          return await response.clone().text();
        } catch {
          return null;
        }
      });

    throw new ApiError(
      `HTTP ${response.status} ${response.statusText}`,
      response.status,
      payload
    );
  }

  const raw = await parseJsonSafely(response);
  const parsedData = parseCatalogResponse(raw);
  const resolvedEtag = extractEtag(response, raw);

  return { data: parsedData, etag: resolvedEtag, raw };
}

export async function getCatalog(
  params: GetCatalogParams = {}
): Promise<CatalogData> {
  const locale = params.locale;
  const cached = readCache(locale);
  const cachedEtag = cached?.etag ?? null;

  try {
    const { data, etag } = await fetchCatalogFromServer(params, cachedEtag);
    writeCache(locale, {
      etag: etag ?? cachedEtag,
      data,
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 304) {
      if (cached?.data) {
        return cached.data;
      }

      clearCache(locale);
      const { data, etag } = await fetchCatalogFromServer(params, null);
      writeCache(locale, { etag, data });
      return data;
    }

    if (error instanceof ApiError && error.status === 422) {
      clearCache(locale);
    }

    throw error;
  }
}
