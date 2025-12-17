import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  githubSyncStatusDataSchema,
  type GithubSyncStatusData,
} from "@/entities/github/model/types";

export async function getGithubSyncStatus(): Promise<GithubSyncStatusData> {
  return requestWithSchema(
    GITHUB_ENDPOINTS.status,
    githubSyncStatusDataSchema,
    {
      method: "GET",
    }
  );
}
