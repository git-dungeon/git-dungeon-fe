export interface ApiResponseMeta {
  requestId?: string;
  generatedAt?: string;
  [key: string]: unknown;
}

export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta?: ApiResponseMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success;
}

export function extractApiData<T>(response: ApiResponse<T>): T {
  console.log(response);
  if (response.success) {
    return response.data;
  }

  const message = response.error?.message ?? "API 요청이 실패했습니다.";
  throw new Error(message);
}
