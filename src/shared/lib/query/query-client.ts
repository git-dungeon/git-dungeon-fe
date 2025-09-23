import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { PersistQueryClientOptions } from "@tanstack/react-query-persist-client";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 30,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

function createPersister() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return createSyncStoragePersister({
    storage: window.localStorage,
  });
}

const persister = createPersister();

export const queryClient = createQueryClient();

type PersistOptions = Omit<PersistQueryClientOptions, "queryClient">;

export const queryClientPersistOptions: PersistOptions | undefined = persister
  ? {
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          const rootKey = query.queryKey.at(0);
          if (rootKey === "auth") {
            return false;
          }

          return query.state.status === "success";
        },
      },
    }
  : undefined;
