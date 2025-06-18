import { useEffect } from "react";
import { useAsyncRequest } from "@/hooks/useAsyncRequest";

/**
 * A React hook that automatically triggers an async API function on mount
 * or when specified dependencies change. It builds on top of `useAsyncRequest`,
 * providing data-fetching behavior with built-in state management.
 *
 * The provided async function (`apiFn`) must accept an options object as its last
 * parameter and use the `signal` for cancellation via `AbortController`.
 *
 * @template {(...args: any[]) => Promise<any>} Fn
 * @param {Fn} apiFn - The async function that performs the API request. It must accept
 *                     an `options` object as its final argument, including an AbortSignal.
 * @param {Object} [opts] - Optional configuration.
 * @param {Array} [opts.args=[]] - Arguments to pass to `apiFn` when called.
 * @param {Array} [opts.deps=[]] - Dependency array that triggers re-fetching when any value changes.
 * @param {(data: Awaited<ReturnType<Fn>>) => void} [opts.onSuccess] - Callback for successful responses.
 * @param {(err: unknown) => void} [opts.onError] - Callback for request errors (excluding aborts).
 *
 * @returns {{
 *   run: (...args: Parameters<Fn>) => Promise<ReturnType<Fn>>,
 *   isLoading: boolean,
 *   isSuccess: boolean,
 *   error: string | null,
 *   data: Awaited<ReturnType<Fn>> | null
 * }} An object containing:
 *   - `run`: Manually trigger the request.
 *   - `isLoading`: Whether the request is currently in progress.
 *   - `isSuccess`: Whether the last request succeeded.
 *   - `error`: Error message if the request failed, or `null`.
 *   - `data`: The most recent successful response data, or `null`.
 *
 * @example
 * const { data, isLoading, error } = useAutoFetch(fetchUserById, {
 *   args: [userId],
 *   deps: [userId],
 *   onSuccess: user => console.log("User loaded", user),
 *   onError: err => console.error("Failed to load user", err),
 * });
 */
export function useAutoFetch(apiFn, { deps = [], args = [], onSuccess, onError } = {}) {
  const asyncRequest = useAsyncRequest(apiFn, { onSuccess, onError });

  useEffect(() => {
    asyncRequest.run(...args);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return asyncRequest;
}
