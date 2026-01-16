import { CATALOG_ENDPOINTS } from "@/shared/config/env";
import { ApiError, apiClient } from "@/shared/api/http-client";
import {
  createApiResponseSchema,
  formatZodError,
  type ApiResponse,
} from "@/shared/api/api-response";
import { createAppError } from "@/shared/errors/app-error";
import { normalizeError } from "@/shared/errors/normalize-error";
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
      throw createAppError(
        "NETWORK_FAILED",
        "API 응답이 JSON 형식이 아닙니다. 백엔드 URL 또는 프록시 설정을 확인하세요.",
        { cause: context }
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
    throw createAppError(
      "API_VALIDATION",
      "API 응답 스키마가 올바르지 않습니다.",
      {
        cause: parsed.error,
        meta: {
          zod: formatZodError(parsed.error),
        },
      }
    );
  }

  const response = parsed.data as ApiResponse<CatalogData>;

  if (!response.success) {
    const errorPayload = response.error;
    throw createAppError("UNKNOWN", errorPayload.message, {
      meta: {
        error: errorPayload,
        meta: response.meta,
      },
    });
  }

  return response.data;
}

type CatalogFetchResult =
  | { status: "ok"; data: CatalogData; etag: string | null; raw: unknown }
  | { status: "not-modified"; etag: string | null };

async function fetchCatalogFromServer(
  params: GetCatalogParams,
  etag: string | null
): Promise<CatalogFetchResult> {
  const requestPath = CATALOG_ENDPOINTS.catalog.replace(/^\//, "");
  let response: Response;

  try {
    response = await apiClient(requestPath, {
      method: "GET",
      throwHttpErrors: false,
      headers: etag ? { "If-None-Match": etag } : undefined,
      searchParams: params.locale ? { locale: params.locale } : undefined,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw createAppError("NETWORK_FAILED", "Network request failed", {
        cause: error,
      });
    }
    throw normalizeError(error);
  }

  if (response.status === 304) {
    return { status: "not-modified", etag: extractEtag(response) };
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

    throw normalizeError(
      new ApiError(
        `HTTP ${response.status} ${response.statusText}`,
        response.status,
        payload
      )
    );
  }

  const raw = await parseJsonSafely(response);
  const parsedData = parseCatalogResponse(raw);
  const resolvedEtag = extractEtag(response, raw);

  return { status: "ok", data: parsedData, etag: resolvedEtag, raw };
}

export async function getCatalog(
  params: GetCatalogParams = {}
): Promise<CatalogData> {
  const locale = params.locale;
  const cached = readCache(locale);
  const cachedEtag = cached?.etag ?? null;

  try {
    const response = await fetchCatalogFromServer(params, cachedEtag);

    if (response.status === "not-modified") {
      if (cached?.data) {
        return cached.data;
      }

      clearCache(locale);
      const fallback = await fetchCatalogFromServer(params, null);
      if (fallback.status === "not-modified") {
        throw createAppError("UNKNOWN", "Catalog cache miss");
      }
      writeCache(locale, { etag: fallback.etag ?? null, data: fallback.data });
      return fallback.data;
    }

    writeCache(locale, {
      etag: response.etag ?? cachedEtag,
      data: response.data,
    });
    return response.data;
  } catch (error) {
    const normalized = normalizeError(error);

    if (normalized.code === "API_VALIDATION") {
      clearCache(locale);
    }

    throw normalized;
  }
}
