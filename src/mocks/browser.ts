import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers/handlers";
import type { AuthSession } from "@/entities/auth/model/types";
import { AUTH_ENDPOINTS } from "@/shared/config/env";
import {
  clearAuthCookies,
  writeAuthCookies,
} from "@/entities/auth/lib/auth-cookie";
import { authStore } from "@/entities/auth/model/access-token-store";

export const worker = setupWorker(...handlers);

export async function startMockServiceWorker() {
  await worker.start({ onUnhandledRequest: "bypass" });

  if (typeof window !== "undefined") {
    window.__mswAuth = {
      login: async (session?: Partial<AuthSession>) => {
        const resolvedSession: AuthSession = {
          userId: session?.userId ?? "user-123",
          username: session?.username ?? "mock-user",
          displayName: session?.displayName ?? "Mocked Adventurer",
          avatarUrl:
            session?.avatarUrl ??
            "https://avatars.githubusercontent.com/u/1?v=4",
        };

        writeAuthCookies(resolvedSession);
        authStore.setAccessToken(`mock-access-${resolvedSession.userId}`);
      },
      logout: async () => {
        await fetch(AUTH_ENDPOINTS.logout, {
          method: "POST",
          credentials: "include",
        });

        clearAuthCookies();
        authStore.clear();
      },
      status: async () => {
        const response = await fetch(AUTH_ENDPOINTS.session, {
          credentials: "include",
        });

        if (!response.ok) {
          return null;
        }

        const json = (await response.json()) as {
          session?: AuthSession;
          accessToken?: string;
        };
        if (json.accessToken) {
          authStore.setAccessToken(json.accessToken);
        }
        return json.session ?? null;
      },
    };
  }
}

declare global {
  interface Window {
    __mswAuth?: {
      login: (session?: Partial<AuthSession>) => Promise<void>;
      logout: () => Promise<void>;
      status: () => Promise<AuthSession | null>;
    };
  }
}
