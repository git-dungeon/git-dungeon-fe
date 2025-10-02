import {
  EMBED_LANGUAGE_VALUES,
  EMBED_PREVIEW_SIZE_VALUES,
  EMBED_THEME_VALUES,
} from "@/entities/embed/model/types";
import { z } from "zod";

const embedSearchSchema = z
  .object({
    userId: z.string().trim().min(1, {
      message: "userId query parameter cannot be empty",
    }),
    theme: z.enum(EMBED_THEME_VALUES).optional(),
    size: z.enum(EMBED_PREVIEW_SIZE_VALUES).optional(),
    language: z.enum(EMBED_LANGUAGE_VALUES).optional(),
  })
  .transform((value) => ({
    userId: value.userId,
    theme: value.theme ?? "dark",
    size: value.size ?? "wide",
    language: value.language ?? "ko",
  }));

type EmbedSearchResult = z.infer<typeof embedSearchSchema>;

export interface EmbedSearchParams {
  userId: string | null;
  theme: EmbedSearchResult["theme"];
  size: EmbedSearchResult["size"];
  language: EmbedSearchResult["language"];
  error?: string;
}

export function parseEmbedSearch(search: unknown): EmbedSearchParams {
  const result = embedSearchSchema.safeParse(search);

  if (!result.success) {
    const message = buildErrorMessage(result.error);

    return {
      userId: null,
      theme: "dark",
      size: "wide",
      language: "ko",
      error: message,
    };
  }

  return {
    userId: result.data.userId,
    theme: result.data.theme,
    size: result.data.size,
    language: result.data.language,
  };
}

function buildErrorMessage(error: z.ZodError): string {
  const firstIssue = error.issues.at(0);

  if (!firstIssue) {
    return "Invalid embed search parameters.";
  }

  const firstPathSegment = firstIssue.path.at(0);

  if (firstPathSegment === "userId") {
    if (firstIssue.code === "invalid_type") {
      return "userId query parameter is required";
    }

    if (firstIssue.code === "too_small") {
      return "userId query parameter cannot be empty";
    }
  }

  if (firstIssue.message) {
    return firstIssue.message;
  }

  return "Invalid embed search parameters.";
}
