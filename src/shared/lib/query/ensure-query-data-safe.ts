import type {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserverOptions,
} from "@tanstack/react-query";
import { ApiError, NetworkError } from "@/shared/api/http-client";

export async function ensureQueryDataSafe<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
): Promise<void> {
  try {
    await queryClient.ensureQueryData(options);
  } catch (error) {
    if (
      error instanceof ApiError ||
      error instanceof NetworkError ||
      (error instanceof Error && /Network request failed/.test(error.message))
    ) {
      if (import.meta.env.DEV) {
        console.warn("[query.ensureSafe] failed prefetch", {
          queryKey: options.queryKey,
          error,
        });
      }
      return;
    }

    throw error;
  }
}
