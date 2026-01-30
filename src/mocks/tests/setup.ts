import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";
import { resetApiClientAuthentication } from "@/shared/api/http-client";
import { resetInventoryMockState } from "@/mocks/handlers/inventory-handlers";
import { resetGithubMockState } from "@/mocks/handlers/github-handlers";
import { resetLevelUpMockState } from "@/mocks/handlers/level-up-handlers";
import { resetChestMockState } from "@/mocks/handlers/chest-handlers";
import "@/shared/i18n/i18n";

class TestResizeObserver {
  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }

  disconnect() {
    return undefined;
  }
}

beforeAll(() => {
  process.env.VITE_API_BASE_URL =
    process.env.VITE_API_BASE_URL ?? "http://localhost";
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = TestResizeObserver;
  }
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetApiClientAuthentication();
  resetInventoryMockState();
  resetGithubMockState();
  resetLevelUpMockState();
  resetChestMockState();
});

afterAll(() => {
  server.close();
});
