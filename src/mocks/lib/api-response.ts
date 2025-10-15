import { HttpResponse } from "msw";
import type {
  ApiErrorPayload,
  ApiResponseMeta,
} from "@/shared/api/api-response";

interface SuccessResponseOptions {
  status?: number;
  headers?: HeadersInit;
  meta?: ApiResponseMeta;
}

interface ErrorResponseOptions extends SuccessResponseOptions {
  code?: string;
  details?: Record<string, unknown>;
}

const DEFAULT_STATUS = 200;

export function respondWithSuccess<T>(
  data: T,
  options: SuccessResponseOptions = {}
) {
  const { status = DEFAULT_STATUS, headers, meta } = options;
  const body = meta ? { success: true, data, meta } : { success: true, data };

  return HttpResponse.json(body, {
    status,
    headers,
  });
}

export function respondWithError(
  message: string,
  options: ErrorResponseOptions = {}
) {
  const { status = 400, headers, code, details, meta } = options;

  const error: ApiErrorPayload = {
    message,
    ...(code ? { code } : {}),
    ...(details ? { details } : {}),
  };

  const body = meta
    ? {
        success: false,
        error,
        meta,
      }
    : {
        success: false,
        error,
      };

  return HttpResponse.json(body, {
    status,
    headers,
  });
}
