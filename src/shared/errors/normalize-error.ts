import { AppError, createAppError, isAppError } from "./app-error";
import type { AppErrorCode } from "./app-error-codes";

const DEFAULT_MESSAGE = "요청 처리 중 오류가 발생했습니다.";

function resolveCodeFromStatus(status?: number): AppErrorCode {
  if (status === 400) return "API_BAD_REQUEST";
  if (status === 401) return "AUTH_UNAUTHORIZED";
  if (status === 403) return "AUTH_FORBIDDEN";
  if (status === 404) return "API_NOT_FOUND";
  if (status === 409) return "API_CONFLICT";
  if (status === 422) return "API_VALIDATION";
  if (status === 429) return "API_RATE_LIMIT";
  if (status && status >= 500 && status < 600) return "API_SERVER";
  return "UNKNOWN";
}

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (isApiError(error)) {
    const code = resolveCodeFromStatus(error.status);
    return createAppError(code, error.message || DEFAULT_MESSAGE, {
      cause: error,
      meta: {
        status: error.status,
        payload: error.payload,
      },
    });
  }

  if (isNetworkError(error)) {
    return createAppError("NETWORK_FAILED", error.message || DEFAULT_MESSAGE, {
      cause: error,
    });
  }

  if (error instanceof Error) {
    return createAppError("UNKNOWN", error.message || DEFAULT_MESSAGE, {
      cause: error,
    });
  }

  return createAppError("UNKNOWN", DEFAULT_MESSAGE, {
    cause: error,
  });
}

function isApiError(
  error: unknown
): error is {
  name: string;
  status: number;
  payload?: unknown;
  message: string;
} {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number" &&
    (error as { name?: string }).name === "ApiError"
  );
}

function isNetworkError(
  error: unknown
): error is { name: string; message: string } {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (error as { name?: string }).name === "NetworkError";
}
