import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { CATALOG_QUERY_KEY } from "@/entities/catalog/model/catalog-query";
import { createMockCatalogData } from "@/mocks/fixtures/catalog";

const DEFAULT_CATALOG_QUERY_KEY = [...CATALOG_QUERY_KEY, "default"] as const;

export function WithCatalogPrefill({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(DEFAULT_CATALOG_QUERY_KEY, () =>
      createMockCatalogData()
    );

    return () => {
      queryClient.removeQueries({
        queryKey: DEFAULT_CATALOG_QUERY_KEY,
        exact: true,
      });
    };
  }, [queryClient]);

  return <>{children}</>;
}
