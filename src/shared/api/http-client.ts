import ky, { HTTPError, type Options } from "ky";
import { resolveApiUrl } from "@/shared/config/env";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

type ExtendedHeadersInit = HeadersInit | Record<string, string | undefined>;

function mergeHeaders(
  base: HeadersInit,
  override?: ExtendedHeadersInit
): Headers {
  const merged = new Headers(base);

  if (!override) {
    return merged;
  }

  if (override instanceof Headers) {
    override.forEach((value, key) => {
      merged.set(key, value);
    });

    return merged;
  }

  if (Array.isArray(override)) {
    override.forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        merged.set(key, value);
      }
    });

    return merged;
  }

  if (override !== null && typeof override === "object") {
    const iterator = (override as Record<symbol, unknown>)[Symbol.iterator];
    if (typeof iterator === "function") {
      for (const entry of override as unknown as Iterable<[string, string]>) {
        const [key, value] = entry;
        merged.set(key, value);
      }

      return merged;
    }
  }

  Object.entries(override as Record<string, string | undefined>).forEach(
    ([key, value]) => {
      if (typeof value === "undefined") {
        return;
      }

      merged.set(key, value);
    }
  );

  return merged;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface HttpRequestConfig extends Options {
  parseAs?: "json" | "text" | "none";
}

export async function httpRequest<TResponse>(
  path: string,
  config: HttpRequestConfig = {}
): Promise<TResponse> {
  const { parseAs = "json", headers, credentials, ...rest } = config;
  const url = resolveApiUrl(path);

  try {
    const response = await ky(url, {
      credentials: credentials ?? "include",
      headers: mergeHeaders(DEFAULT_HEADERS, headers),
      ...rest,
    });

    if (response.status === 204 || parseAs === "none") {
      return undefined as TResponse;
    }

    if (parseAs === "text") {
      return (await response.text()) as TResponse;
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof HTTPError) {
      const { response } = error;
      let payload: unknown = null;

      try {
        payload = await response.clone().json();
      } catch {
        try {
          payload = await response.clone().text();
        } catch {
          payload = null;
        }
      }

      throw new ApiError(
        `HTTP ${response.status} ${response.statusText}`,
        response.status,
        payload
      );
    }

    throw error;
  }
}

export async function httpGet<TResponse>(
  path: string,
  config: Omit<HttpRequestConfig, "method"> = {}
): Promise<TResponse> {
  return httpRequest<TResponse>(path, {
    method: "GET",
    ...config,
  });
}
