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
    const isFetchTypeError =
      error instanceof TypeError &&
      /Failed to fetch|fetch failed|NetworkError/i.test(error.message);

    if (
      error instanceof ApiError ||
      error instanceof NetworkError ||
      isFetchTypeError ||
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
