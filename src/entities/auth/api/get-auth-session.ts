import { AUTH_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import { normalizeError } from "@/shared/errors/normalize-error";
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
    const normalized = normalizeError(error);

    if (
      normalized.code === "AUTH_UNAUTHORIZED" ||
      normalized.code === "AUTH_FORBIDDEN" ||
      normalized.code === "API_NOT_FOUND"
    ) {
      return null;
    }

    const payloadError = (
      normalized.meta?.payload as { error?: { code?: string } } | undefined
    )?.error;

    if (payloadError) {
      return null;
    }

    if (normalized.code.startsWith("NETWORK_")) {
      throw normalized;
    }

    throw normalized;
  }
}
