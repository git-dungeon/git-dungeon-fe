import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  githubSyncDataSchema,
  type GitHubSyncData,
} from "@/entities/github/model/types";

export async function postGitHubSync(): Promise<GitHubSyncData> {
  return requestWithSchema(GITHUB_ENDPOINTS.sync, githubSyncDataSchema, {
    method: "POST",
  });
}
