import { http } from "msw";
import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { mockProfileOverview } from "@/mocks/fixtures/profile-overview";

const SYNC_COOLDOWN_MS = 6 * 60 * 60 * 1000;

function resolveLastSyncAt(): string | null {
  return mockProfileOverview.connections.github?.lastSyncAt ?? null;
}

function setLastSyncAt(value: string) {
  if (!mockProfileOverview.connections.github) {
    mockProfileOverview.connections.github = {
      connected: true,
      lastSyncAt: value,
    };
    return;
  }

  mockProfileOverview.connections.github.lastSyncAt = value;
}

function buildSyncStatus() {
  const githubConnection = mockProfileOverview.connections.github;
  const connected = githubConnection?.connected ?? false;

  if (!connected) {
    return {
      connected: false,
      allowed: false,
      cooldownMs: SYNC_COOLDOWN_MS,
      lastSyncAt: null,
      nextAvailableAt: null,
      retryAfterMs: null,
    };
  }

  const lastSyncAt = resolveLastSyncAt();
  if (!lastSyncAt) {
    return {
      connected: true,
      allowed: true,
      cooldownMs: SYNC_COOLDOWN_MS,
      lastSyncAt: null,
      nextAvailableAt: null,
      retryAfterMs: null,
    };
  }

  const lastSyncTime = new Date(lastSyncAt).getTime();
  if (Number.isNaN(lastSyncTime)) {
    return {
      connected: true,
      allowed: true,
      cooldownMs: SYNC_COOLDOWN_MS,
      lastSyncAt: null,
      nextAvailableAt: null,
      retryAfterMs: null,
    };
  }

  const nextAvailableAt = new Date(lastSyncTime + SYNC_COOLDOWN_MS);
  const remaining = nextAvailableAt.getTime() - Date.now();

  if (remaining <= 0) {
    return {
      connected: true,
      allowed: true,
      cooldownMs: SYNC_COOLDOWN_MS,
      lastSyncAt,
      nextAvailableAt: null,
      retryAfterMs: 0,
    };
  }

  return {
    connected: true,
    allowed: false,
    cooldownMs: SYNC_COOLDOWN_MS,
    lastSyncAt,
    nextAvailableAt: nextAvailableAt.toISOString(),
    retryAfterMs: remaining,
  };
}

export const githubHandlers = [
  http.get(GITHUB_ENDPOINTS.status, () => {
    return respondWithSuccess(buildSyncStatus());
  }),
  http.post(GITHUB_ENDPOINTS.sync, ({ request }) => {
    const forcedStatus = request.headers.get("x-msw-force-status");

    if (forcedStatus === "400") {
      return respondWithError("GitHub 계정이 연동되어 있지 않습니다.", {
        status: 400,
        code: "GITHUB_NOT_CONNECTED",
      });
    }

    if (forcedStatus === "409") {
      return respondWithError("수동 동기화를 진행할 수 없습니다.", {
        status: 409,
        code: "GITHUB_SYNC_TOO_FREQUENT",
      });
    }

    if (forcedStatus === "429") {
      return respondWithError("GitHub 요청 한도에 도달했습니다.", {
        status: 429,
        code: "GITHUB_RATE_LIMITED",
      });
    }

    const githubConnection = mockProfileOverview.connections.github;
    if (!githubConnection?.connected) {
      return respondWithError("GitHub 계정이 연동되어 있지 않습니다.", {
        status: 400,
        code: "GITHUB_NOT_CONNECTED",
      });
    }

    const lastSyncAt = resolveLastSyncAt();
    if (lastSyncAt) {
      const lastSyncTime = new Date(lastSyncAt).getTime();
      if (!Number.isNaN(lastSyncTime)) {
        if (Date.now() - lastSyncTime < SYNC_COOLDOWN_MS) {
          return respondWithError("수동 동기화를 진행할 수 없습니다.", {
            status: 409,
            code: "GITHUB_SYNC_TOO_FREQUENT",
          });
        }
      }
    }

    const now = new Date();
    const nextLastSyncAt = now.toISOString();
    setLastSyncAt(nextLastSyncAt);

    const windowStart = new Date(
      now.getTime() - 6 * 60 * 60 * 1000
    ).toISOString();
    const windowEnd = now.toISOString();

    return respondWithSuccess({
      contributions: 0,
      windowStart,
      windowEnd,
      tokenType: "oauth",
      rateLimitRemaining: 50,
      logId: crypto.randomUUID(),
      meta: {
        remaining: 50,
        resetAt: null,
        resource: "core",
      },
    });
  }),
];
