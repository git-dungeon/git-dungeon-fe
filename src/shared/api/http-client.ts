import ky, { HTTPError, type KyInstance, type Options } from "ky";
import { z } from "zod";
import { EFFECTIVE_API_BASE_URL } from "@/shared/config/env";
import { getAccessTokenFromProvider } from "@/shared/api/access-token-provider";
import {
  createApiResponseSchema,
  formatZodError,
  type ApiResponse,
} from "@/shared/api/api-response";

const SKIP_AUTH_HEADER = "x-skip-auth";
const REFRESH_ATTEMPT_HEADER = "x-refresh-attempted";
const AUTH_REFRESH_ENDPOINT_SEGMENT = "/auth/refresh";

const DEFAULT_BASE_URL = EFFECTIVE_API_BASE_URL;
const DEFAULT_BASE_ORIGIN = (() => {
  try {
    return new URL(DEFAULT_BASE_URL).origin;
  } catch {
    if (typeof window !== "undefined" && window.location?.origin) {
      try {
        return new URL(DEFAULT_BASE_URL, window.location.origin).origin;
      } catch {
        return window.location.origin;
      }
    }

    return "http://localhost";
  }
})();

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
  readonly cause?: unknown;

  constructor(message = "Network request failed", cause?: unknown) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
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

  if (init instanceof Headers || Array.isArray(init)) {
    return new Headers(init);
  }

  const definedEntries = Object.entries(init).reduce<[string, string][]>(
    (acc, [key, value]) => {
      if (typeof value !== "undefined") {
        acc.push([key, value]);
      }
      return acc;
    },
    []
  );

  return new Headers(definedEntries);
}

function hasRefreshAttempted(request: Request, options: Options): boolean {
  if (request.headers.get(REFRESH_ATTEMPT_HEADER) === "true") {
    return true;
  }

  if (!options.headers) {
    return false;
  }

  const retryHeader = new Headers(
    options.headers as HeadersInit | undefined
  ).get(REFRESH_ATTEMPT_HEADER);

  return retryHeader === "true";
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

  const requestOptions: Options & { includeAuthToken?: boolean } = {
    ...rest,
    headers: headerOverride,
  };

  if (typeof includeAuthToken !== "undefined") {
    requestOptions.includeAuthToken = includeAuthToken;
  }

  try {
    const response = await apiClient(requestPath, requestOptions);
    return parseResponseBody<TResponse>(response, parseAs);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function parseResponseBody<TResponse>(
  response: Response,
  mode: HttpRequestConfig["parseAs"]
): Promise<TResponse> {
  if (response.status === 204 || mode === "none") {
    return undefined as TResponse;
  }

  if (mode === "text") {
    return (await response.text()) as TResponse;
  }

  return parseJsonBody<TResponse>(response);
}

async function parseJsonBody<TResponse>(
  response: Response
): Promise<TResponse> {
  const responseForDebug = response.clone();

  try {
    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const preview = await readTextSafely(responseForDebug);
      const context = preview ? { error, preview } : error;

      throw new NetworkError(
        "API 응답이 JSON 형식이 아닙니다. 백엔드 URL 또는 프록시 설정을 확인하세요.",
        context
      );
    }

    throw error;
  }
}

async function readTextSafely(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

async function handleRequestError(error: unknown): Promise<never> {
  if (error instanceof HTTPError) {
    const { response } = error;
    const payload = await extractResponsePayload(response);

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

async function extractResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.clone().json();
  } catch {
    try {
      return await response.clone().text();
    } catch {
      return null;
    }
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

  return mapData ? mapData(response.data) : response.data;
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
