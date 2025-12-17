import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";
import { resetApiClientAuthentication } from "@/shared/api/http-client";
import { resetInventoryMockState } from "@/mocks/handlers/inventory-handlers";
import { resetGithubMockState } from "@/mocks/handlers/github-handlers";

beforeAll(() => {
  process.env.VITE_API_BASE_URL =
    process.env.VITE_API_BASE_URL ?? "http://localhost";
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetApiClientAuthentication();
  resetInventoryMockState();
  resetGithubMockState();
});

afterAll(() => {
  server.close();
});
