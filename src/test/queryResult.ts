/**
 * Builds the subset of a TanStack Query result consumed by presentation tests.
 * The unsafe boundary stays here instead of being repeated in every mock.
 */
export function queryResult<TResult>(data: unknown): TResult {
  return {
    data,
    isLoading: false,
    isError: false,
  } as unknown as TResult
}
