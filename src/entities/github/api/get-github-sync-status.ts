import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  githubSyncStatusDataSchema,
  type GitHubSyncStatusData,
} from "@/entities/github/model/types";

export async function getGitHubSyncStatus(): Promise<GitHubSyncStatusData> {
  return requestWithSchema(
    GITHUB_ENDPOINTS.status,
    githubSyncStatusDataSchema,
    {
      method: "GET",
    }
  );
}
