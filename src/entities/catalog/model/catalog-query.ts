import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "@/entities/catalog/api/get-catalog";
import { isAppError } from "@/shared/errors/app-error";

export type CatalogLocale = "ko" | "en";

export const CATALOG_QUERY_KEY = ["catalog"] as const;

export function catalogQueryOptions(locale?: CatalogLocale) {
  return queryOptions({
    queryKey: [...CATALOG_QUERY_KEY, locale ?? "default"] as const,
    queryFn: () => getCatalog({ locale }),
    staleTime: 1000 * 60 * 60 * 24,
    retry: (failureCount, error) => {
      if (isAppError(error) && error.code.startsWith("NETWORK_")) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });
}
