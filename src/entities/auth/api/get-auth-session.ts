import { AUTH_ENDPOINTS } from "@/shared/config/env";
import {
  ApiError,
  NetworkError,
  requestWithSchema,
} from "@/shared/api/http-client";
import { authStore } from "@/entities/auth/model/access-token-store";
import { authSessionPayloadSchema, type AuthSession } from "../model/types";

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const payload = await requestWithSchema(
      AUTH_ENDPOINTS.session,
      authSessionPayloadSchema
    );

    const session = payload.session ?? null;

    if (!session) {
      authStore.clear();
      return null;
    }

    if (payload.accessToken) {
      authStore.setAccessToken(payload.accessToken);
    }

    return session;
  } catch (error) {
    if (error instanceof ApiError) {
      if ([401, 403, 404].includes(error.status)) {
        authStore.clear();
        return null;
      }

      const payloadError = (
        error.payload as { error?: { code?: string } } | undefined
      )?.error;

      if (payloadError) {
        authStore.clear();
        return null;
      }
    }

    if (error instanceof NetworkError) {
      authStore.clear();
    }

    throw error;
  }
}
