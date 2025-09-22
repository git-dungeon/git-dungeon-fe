import { AUTH_ENDPOINTS } from "@/shared/config/env";
import { ApiError, httpGet } from "@/shared/api/http-client";
import type { AuthSession } from "../model/types";

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const response = await httpGet<AuthSession | undefined>(
      AUTH_ENDPOINTS.session,
      {
        parseAs: "json",
      }
    );

    return response ?? null;
  } catch (error) {
    if (error instanceof ApiError) {
      if ([401, 403, 404].includes(error.status)) {
        return null;
      }
    }

    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
}
