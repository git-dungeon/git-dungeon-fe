import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";
import { authStore } from "@/entities/auth/model/access-token-store";
import { resetAccessTokenProvider } from "@/shared/api/access-token-provider";

beforeAll(() => {
  process.env.VITE_API_BASE_URL =
    process.env.VITE_API_BASE_URL ?? "http://localhost";
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  authStore.clear();
  resetAccessTokenProvider();
});

afterAll(() => {
  server.close();
});
