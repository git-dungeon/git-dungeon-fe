import { describe, expect, it } from "vitest";
import { normalizeError } from "./normalize-error";
import { ApiError, NetworkError } from "@/shared/api/http-client";

describe("normalizeError", () => {
  it("ApiError는 상태 코드에 맞는 AppError로 변환된다", () => {
    const error = new ApiError("Unauthorized", 401, {
      error: { code: "AUTH" },
    });
    const normalized = normalizeError(error);

    expect(normalized.code).toBe("AUTH_UNAUTHORIZED");
    expect(normalized.meta?.status).toBe(401);
  });

  it("NetworkError는 NETWORK_FAILED로 변환된다", () => {
    const error = new NetworkError("Network request failed");
    const normalized = normalizeError(error);

    expect(normalized.code).toBe("NETWORK_FAILED");
  });

  it("unknown 에러는 UNKNOWN으로 변환된다", () => {
    const normalized = normalizeError({ reason: "unknown" });

    expect(normalized.code).toBe("UNKNOWN");
  });
});
