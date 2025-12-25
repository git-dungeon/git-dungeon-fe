import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { catalogQueryOptions, type CatalogLocale } from "./catalog-query";
import type { CatalogData } from "./types";

export function useCatalog(
  locale?: CatalogLocale
): UseQueryResult<CatalogData> {
  return useQuery(catalogQueryOptions(locale));
}
