const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const IS_VITEST_ENV =
  typeof process !== "undefined" && process.env?.VITEST === "true";

const LOCAL_ORIGIN =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "http://localhost";

export const API_BASE_URL =
  RAW_API_BASE_URL && RAW_API_BASE_URL.length > 0
    ? RAW_API_BASE_URL
    : undefined;

export const IS_MSW_ENABLED =
  IS_VITEST_ENV ||
  (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true");

function determineEffectiveBaseUrl(): string {
  if (!API_BASE_URL) {
    return LOCAL_ORIGIN;
  }

  if (IS_MSW_ENABLED && typeof window !== "undefined") {
    try {
      const configured = new URL(API_BASE_URL);

      if (configured.origin !== window.location.origin) {
        if (import.meta.env.DEV) {
          console.warn(
            "[env] MSW 활성화 상태에서 VITE_API_BASE_URL이 현재 오리진과 다릅니다. 개발 환경에서는 동일 오리진을 사용하도록 window.location.origin을 대신 사용합니다.",
            {
              configured: configured.origin,
              fallback: window.location.origin,
            }
          );
        }

        return window.location.origin;
      }
    } catch {
      return API_BASE_URL;
    }
  }

  return API_BASE_URL;
}

export const EFFECTIVE_API_BASE_URL = determineEffectiveBaseUrl();

if (!API_BASE_URL && !IS_VITEST_ENV && import.meta.env.PROD) {
  throw new Error(
    "VITE_API_BASE_URL가 설정되지 않았습니다. 프로덕션 환경에서는 API 기반 주소가 반드시 필요합니다."
  );
}

export const AUTH_ENDPOINTS = {
  startGithubOAuth: "/auth/github",
  session: "/api/auth/session",
  logout: "/api/auth/logout",
} as const;

export const DASHBOARD_ENDPOINTS = {
  state: "/api/state",
  logs: "/api/logs",
} as const;

export const INVENTORY_ENDPOINTS = {
  list: "/api/inventory",
  equip: "/api/inventory/equip",
  unequip: "/api/inventory/unequip",
  discard: "/api/inventory/discard",
} as const;

export const SETTINGS_ENDPOINTS = {
  profile: "/api/settings",
  preview: "/api/settings/preview",
} as const;

export const EMBEDDING_ENDPOINTS = {
  preview: "/api/embedding/preview",
} as const;

export function resolveApiUrl(path: string): string {
  if (/^https?:/i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE_URL) {
    if (typeof window === "undefined" || IS_VITEST_ENV) {
      return new URL(normalizedPath, LOCAL_ORIGIN).toString();
    }

    return normalizedPath;
  }

  return new URL(normalizedPath, EFFECTIVE_API_BASE_URL).toString();
}
