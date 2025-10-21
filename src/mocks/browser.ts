import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers/handlers";
import type { AuthSession } from "@/entities/auth/model/types";
import { AUTH_ENDPOINTS } from "@/shared/config/env";
import {
  clearAuthCookies,
  writeAuthCookies,
} from "@/entities/auth/lib/auth-cookie";

export const worker = setupWorker(...handlers);

export async function startMockServiceWorker() {
  await worker.start({ onUnhandledRequest: "bypass" });

  if (typeof window !== "undefined") {
    window.__mswAuth = {
      login: async (session?: Partial<AuthSession>) => {
        const resolvedSession: AuthSession = {
          userId: session?.userId ?? "user-123",
          username: session?.username ?? "mock-user",
          email: session?.email ?? "mock-user@example.com",
          displayName: session?.displayName ?? "Mocked Adventurer",
          avatarUrl:
            session?.avatarUrl ??
            "https://avatars.githubusercontent.com/u/1?v=4",
        };

        writeAuthCookies(resolvedSession);
      },
      logout: async () => {
        await fetch(AUTH_ENDPOINTS.logout, {
          method: "POST",
          credentials: "include",
        });

        clearAuthCookies();
      },
      status: async () => {
        const response = await fetch(AUTH_ENDPOINTS.session, {
          credentials: "include",
        });

        if (!response.ok) {
          return null;
        }

        const json = (await response.json()) as {
          success?: boolean;
          data?: {
            session?: AuthSession | null;
            refreshed?: boolean;
          };
        };

        if (!json.success) {
          return null;
        }

        return json.data?.session ?? null;
      },
    };
  }
}

declare global {
  interface Window {
    __mswAuth?: {
      login: (session?: Partial<AuthSession>) => Promise<void>;
      logout?: () => Promise<void>;
      status?: () => Promise<AuthSession | null>;
    };
  }
}
