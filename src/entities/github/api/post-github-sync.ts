import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  githubSyncDataSchema,
  type GithubSyncData,
} from "@/entities/github/model/types";

export async function postGithubSync(): Promise<GithubSyncData> {
  return requestWithSchema(GITHUB_ENDPOINTS.sync, githubSyncDataSchema, {
    method: "POST",
  });
}
