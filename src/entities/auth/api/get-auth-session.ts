import { AUTH_ENDPOINTS } from "@/shared/config/env";
import {
  ApiError,
  NetworkError,
  requestWithSchema,
} from "@/shared/api/http-client";
import { authSessionPayloadSchema, type AuthSession } from "../model/types";

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const payload = await requestWithSchema(
      AUTH_ENDPOINTS.session,
      authSessionPayloadSchema
    );

    const session = payload.session ?? null;

    return session;
  } catch (error) {
    if (error instanceof ApiError) {
      if ([401, 403, 404].includes(error.status)) {
        return null;
      }

      const payloadError = (
        error.payload as { error?: { code?: string } } | undefined
      )?.error;

      if (payloadError) {
        return null;
      }
    }

    if (error instanceof NetworkError) {
      throw error;
    }

    throw error;
  }
}
