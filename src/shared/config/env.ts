const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  RAW_API_BASE_URL && RAW_API_BASE_URL.length > 0
    ? RAW_API_BASE_URL
    : undefined;

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
} as const;

export const IS_MSW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true";

export function resolveApiUrl(path: string): string {
  if (/^https?:/i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return new URL(normalizedPath, API_BASE_URL).toString();
}
