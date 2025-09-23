import ky, { HTTPError, type Options } from "ky";
import { resolveApiUrl } from "@/shared/config/env";
import { getAccessTokenFromProvider } from "@/shared/api/access-token-provider";

type ExtendedHeadersInit = HeadersInit | Record<string, string | undefined>;

function toHeaders(init?: ExtendedHeadersInit): Headers {
  if (!init) {
    return new Headers();
  }

  if (init instanceof Headers) {
    return new Headers(init);
  }

  if (Array.isArray(init)) {
    return new Headers(init);
  }

  const headers = new Headers();
  Object.entries(init).forEach(([key, value]) => {
    if (typeof value === "undefined") {
      return;
    }

    headers.set(key, value);
  });
  return headers;
}

function isTrustedOrigin(url: URL): boolean {
  if (typeof window !== "undefined") {
    return url.origin === window.location.origin;
  }

  return false;
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
  includeAuthToken?: boolean;
}

export async function httpRequest<TResponse>(
  path: string,
  config: HttpRequestConfig = {}
): Promise<TResponse> {
  const {
    parseAs = "json",
    headers,
    credentials,
    includeAuthToken,
    ...rest
  } = config;
  const resolvedUrl = resolveApiUrl(path);
  const parsedUrl = new URL(
    resolvedUrl,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  );
  const accessToken = getAccessTokenFromProvider();

  try {
    const headerOverride = toHeaders(headers);
    const shouldAttachToken =
      includeAuthToken ??
      (!/^https?:/i.test(resolvedUrl) || isTrustedOrigin(parsedUrl));

    if (shouldAttachToken && accessToken) {
      headerOverride.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await ky(resolvedUrl, {
      credentials: credentials ?? "include",
      headers: headerOverride,
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
