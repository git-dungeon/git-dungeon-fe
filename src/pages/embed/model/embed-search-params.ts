import { z } from "zod";

const EMBED_THEME_VALUES = ["light", "dark"] as const;

export const embedThemeSchema = z.enum(EMBED_THEME_VALUES);

const embedSearchSchema = z
  .object({
    userId: z.string().trim().min(1, {
      message: "userId query parameter cannot be empty",
    }),
    theme: embedThemeSchema.optional(),
  })
  .transform((value) => ({
    userId: value.userId,
    theme: value.theme ?? "dark",
  }));

type EmbedSearchResult = z.infer<typeof embedSearchSchema>;

export interface EmbedSearchParams {
  userId: string | null;
  theme: EmbedSearchResult["theme"];
  error?: string;
}

export function parseEmbedSearch(search: unknown): EmbedSearchParams {
  const result = embedSearchSchema.safeParse(search);

  if (!result.success) {
    const message = buildErrorMessage(result.error);

    return {
      userId: null,
      theme: "dark",
      error: message,
    };
  }

  return {
    userId: result.data.userId,
    theme: result.data.theme,
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
