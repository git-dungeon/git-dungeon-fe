import ky, { HTTPError, type KyInstance, type Options } from "ky";
import { z } from "zod";
import { API_BASE_URL } from "@/shared/config/env";
import { getAccessTokenFromProvider } from "@/shared/api/access-token-provider";
import {
  createApiResponseSchema,
  formatZodError,
  type ApiResponse,
} from "@/shared/api/api-response";

const SKIP_AUTH_HEADER = "x-skip-auth";
const REFRESH_ATTEMPT_HEADER = "x-refresh-attempted";
const AUTH_REFRESH_ENDPOINT_SEGMENT = "/auth/refresh";

const DEFAULT_BASE_URL =
  API_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost");
const DEFAULT_BASE_ORIGIN = new URL(DEFAULT_BASE_URL).origin;

type ExtendedHeadersInit = HeadersInit | Record<string, string | undefined>;

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status = 0, payload: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export class NetworkError extends Error {
  constructor(
    message = "Network request failed",
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export type AccessTokenProvider = () => string | undefined;
export type RefreshTokenHandler = () => Promise<boolean>;
export type ClearSessionHandler = () => void;

interface AuthenticationHandlers {
  getAccessToken: AccessTokenProvider | null;
  refreshAccessToken: RefreshTokenHandler | null;
  clearSession: ClearSessionHandler | null;
}

interface ConfigureAuthenticationOptions {
  getAccessToken?: AccessTokenProvider;
  refreshAccessToken?: RefreshTokenHandler;
  clearSession?: ClearSessionHandler;
}

const authenticationHandlers: AuthenticationHandlers = {
  getAccessToken: () => getAccessTokenFromProvider(),
  refreshAccessToken: null,
  clearSession: null,
};

export function configureApiClientAuthentication({
  getAccessToken,
  refreshAccessToken,
  clearSession,
}: ConfigureAuthenticationOptions = {}): void {
  authenticationHandlers.getAccessToken =
    getAccessToken ?? authenticationHandlers.getAccessToken;
  authenticationHandlers.refreshAccessToken =
    refreshAccessToken ?? authenticationHandlers.refreshAccessToken;
  authenticationHandlers.clearSession =
    clearSession ?? authenticationHandlers.clearSession;
}

export function resetApiClientAuthentication(): void {
  authenticationHandlers.getAccessToken = () => getAccessTokenFromProvider();
  authenticationHandlers.refreshAccessToken = null;
  authenticationHandlers.clearSession = null;
}

const baseClient: KyInstance = ky.create({
  prefixUrl: DEFAULT_BASE_URL,
  credentials: "include",
  retry: {
    limit: 0,
  },
});

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

function hasRefreshAttempted(request: Request, options: Options): boolean {
  if (request.headers.get(REFRESH_ATTEMPT_HEADER) === "true") {
    return true;
  }

  const optionHeaders = options.headers;

  if (!optionHeaders) {
    return false;
  }

  if (optionHeaders instanceof Headers) {
    return optionHeaders.get(REFRESH_ATTEMPT_HEADER) === "true";
  }

  if (Array.isArray(optionHeaders)) {
    return optionHeaders.some(
      ([key, value]) =>
        key.toLowerCase() === REFRESH_ATTEMPT_HEADER && value === "true"
    );
  }

  return (
    typeof optionHeaders === "object" &&
    optionHeaders[REFRESH_ATTEMPT_HEADER] === "true"
  );
}

export const apiClient: KyInstance = baseClient.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        if (request.headers.get(SKIP_AUTH_HEADER) === "true") {
          request.headers.delete(SKIP_AUTH_HEADER);
          return;
        }

        const requestOrigin = new URL(request.url, DEFAULT_BASE_URL).origin;
        if (requestOrigin !== DEFAULT_BASE_ORIGIN) {
          return;
        }

        const accessToken = authenticationHandlers.getAccessToken?.();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) {
          return;
        }

        const includeAuthOption = (
          options as Options & { includeAuthToken?: boolean }
        ).includeAuthToken;
        const skipAuthHeader = request.headers.get(SKIP_AUTH_HEADER) === "true";
        const resolvedRequestUrl = new URL(request.url, DEFAULT_BASE_URL);
        const isExternalRequest =
          /^https?:/i.test(request.url) &&
          resolvedRequestUrl.origin !== DEFAULT_BASE_ORIGIN;

        if (
          skipAuthHeader ||
          includeAuthOption === false ||
          isExternalRequest
        ) {
          return;
        }

        const { refreshAccessToken, clearSession } = authenticationHandlers;
        const alreadyRefreshed = hasRefreshAttempted(request, options);
        const isRefreshRequest = request.url.includes(
          AUTH_REFRESH_ENDPOINT_SEGMENT
        );

        if (alreadyRefreshed || isRefreshRequest || !refreshAccessToken) {
          clearSession?.();
          return;
        }

        try {
          const succeeded = await refreshAccessToken();
          if (!succeeded) {
            clearSession?.();
            return;
          }
        } catch (error) {
          clearSession?.();
          throw error;
        }

        const retryHeaders = new Headers(request.headers);
        retryHeaders.set(REFRESH_ATTEMPT_HEADER, "true");

        const retryRequest = new Request(request, {
          headers: retryHeaders,
        });

        const mergedOptions: Options = {
          ...options,
          headers: retryHeaders,
        };

        return apiClient(retryRequest, mergedOptions);
      },
    ],
  },
});

export interface HttpRequestConfig extends Options {
  parseAs?: "json" | "text" | "none";
  includeAuthToken?: boolean;
}

export async function httpRequest<TResponse>(
  path: string,
  config: HttpRequestConfig = {}
): Promise<TResponse> {
  const { parseAs = "json", includeAuthToken, headers, ...rest } = config;

  const isAbsoluteUrl = /^https?:/i.test(path);
  const requestPath = isAbsoluteUrl ? path : path.replace(/^\//, "");
  const headerOverride = toHeaders(headers);

  if (includeAuthToken === false) {
    headerOverride.set(SKIP_AUTH_HEADER, "true");
  }

  try {
    const requestOptions: Options & { includeAuthToken?: boolean } = {
      ...rest,
      headers: headerOverride,
    };

    if (typeof includeAuthToken !== "undefined") {
      requestOptions.includeAuthToken = includeAuthToken;
    }

    const response = await apiClient(requestPath, requestOptions);

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

    if (error instanceof TypeError) {
      throw new NetworkError("Network request failed", error);
    }

    throw error;
  }
}

export interface RequestWithSchemaOptions<TSchema extends z.ZodTypeAny>
  extends Omit<HttpRequestConfig, "parseAs"> {
  mapData?: (data: z.infer<TSchema>) => z.infer<TSchema>;
}

export async function requestWithSchema<TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
  config: RequestWithSchemaOptions<TSchema> = {}
): Promise<z.infer<TSchema>> {
  const { mapData, ...requestConfig } = config;
  const raw = await httpRequest<unknown>(path, requestConfig);
  const responseSchema = createApiResponseSchema(schema);
  const parsed = responseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new ApiError(
      "API 응답 스키마가 올바르지 않습니다.",
      422,
      formatZodError(parsed.error)
    );
  }

  const response = parsed.data as ApiResponse<z.infer<TSchema>>;

  if (!response.success) {
    const errorPayload = response.error;
    throw new ApiError(errorPayload.message, 200, {
      error: errorPayload,
      meta: response.meta,
    });
  }

  const data = response.data;
  return mapData ? mapData(data) : data;
}

export function httpGetWithSchema<TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
  config: RequestWithSchemaOptions<TSchema> = {}
): Promise<z.infer<TSchema>> {
  return requestWithSchema(path, schema, {
    method: "GET",
    ...config,
  });
}
