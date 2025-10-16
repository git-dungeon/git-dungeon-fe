const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function detectVitestEnv(): boolean {
  if (typeof process !== "undefined" && process.env?.VITEST === "true") {
    return true;
  }

  try {
    const envFlag = import.meta.env?.VITEST;
    if (envFlag === "true" || envFlag === true) {
      return true;
    }

    const runtimeFlag = (import.meta as { vitest?: unknown }).vitest;
    if (runtimeFlag === true) {
      return true;
    }
  } catch {
    // ignore environments that do not expose import.meta
  }

  return false;
}

export const IS_VITEST_ENV = detectVitestEnv();

const BROWSER_ORIGIN =
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

function parseUrl(value: string, base?: string): URL | null {
  try {
    return base ? new URL(value, base) : new URL(value);
  } catch {
    return null;
  }
}

function resolveAbsoluteOrigin(
  baseUrl: string,
  fallbackOrigin: string
): string {
  const absolute = parseUrl(baseUrl)?.origin;
  if (absolute) {
    return absolute;
  }

  const resolved = parseUrl(baseUrl, fallbackOrigin)?.origin;
  if (resolved) {
    return resolved;
  }

  return fallbackOrigin;
}

function computeEffectiveApiBaseOrigin(): string {
  const runtimeOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : null;
  const fallbackOrigin = runtimeOrigin ?? BROWSER_ORIGIN;

  if (!API_BASE_URL) {
    return fallbackOrigin;
  }

  const configuredOrigin = resolveAbsoluteOrigin(API_BASE_URL, fallbackOrigin);

  if (IS_MSW_ENABLED && runtimeOrigin) {
    if (configuredOrigin !== runtimeOrigin) {
      if (import.meta.env.DEV) {
        console.warn(
          "[env] VITE_API_BASE_URL과 현재 오리진이 다릅니다. MSW 활성화 환경에서는 window.location.origin을 사용합니다.",
          {
            configured: configuredOrigin,
            fallback: runtimeOrigin,
          }
        );
      }

      return runtimeOrigin;
    }
  }

  return configuredOrigin;
}

export const EFFECTIVE_API_BASE_URL = computeEffectiveApiBaseOrigin();

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
      return new URL(normalizedPath, BROWSER_ORIGIN).toString();
    }

    return normalizedPath;
  }

  const baseOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : BROWSER_ORIGIN;

  const effectiveOrigin = resolveAbsoluteOrigin(
    API_BASE_URL,
    EFFECTIVE_API_BASE_URL || baseOrigin
  );

  return new URL(normalizedPath, effectiveOrigin).toString();
}
