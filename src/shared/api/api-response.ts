import { z } from "zod";

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
  if (isApiSuccessResponse(response)) {
    return response.data;
  }

  const message = response.error.message ?? "API 요청이 실패했습니다.";
  throw new Error(message);
}

const apiResponseMetaSchemaInternal = z
  .object({
    requestId: z.string().optional(),
    generatedAt: z.string().optional(),
  })
  .catchall(z.unknown());

export const apiResponseMetaSchema = apiResponseMetaSchemaInternal;

export const apiErrorPayloadSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const createApiSuccessResponseSchema = <TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema
) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: apiResponseMetaSchemaInternal.optional(),
  });

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: apiErrorPayloadSchema,
  meta: apiResponseMetaSchemaInternal.optional(),
});

export const createApiResponseSchema = <TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema
) =>
  z.union([createApiSuccessResponseSchema(dataSchema), apiErrorResponseSchema]);

export type ApiResponseSchema<TSchema extends z.ZodTypeAny> = ReturnType<
  typeof createApiResponseSchema<TSchema>
>;

export type InferApiResponse<TSchema extends z.ZodTypeAny> = z.infer<
  ApiResponseSchema<TSchema>
>;

export function formatZodError(error: z.ZodError): Record<string, unknown> {
  return {
    issues: error.issues.map((issue) => ({
      path: issue.path,
      code: issue.code,
      message: issue.message,
    })),
  };
}
