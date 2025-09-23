import { AUTH_ENDPOINTS } from "@/shared/config/env";
import { ApiError, httpGet } from "@/shared/api/http-client";
import { authStore } from "@/entities/auth/model/access-token-store";
import type { AuthSession } from "../model/types";

interface AuthSessionResponse {
  session?: AuthSession;
  accessToken?: string;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const response = await httpGet<AuthSessionResponse | undefined>(
      AUTH_ENDPOINTS.session,
      {
        parseAs: "json",
      }
    );

    if (!response?.session) {
      authStore.clear();
      return null;
    }

    if (response.accessToken) {
      authStore.setAccessToken(response.accessToken);
    }

    return response.session;
  } catch (error) {
    if (error instanceof ApiError) {
      if ([401, 403, 404].includes(error.status)) {
        authStore.clear();
        return null;
      }
    }

    if (error instanceof SyntaxError) {
      authStore.clear();
      return null;
    }

    throw error;
  }
}
