import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A reusable React hook for managing the lifecycle of an asynchronous request.
 *
 * It provides an imperative `run()` function to manually trigger the async operation,
 * while automatically handling common request state such as loading, success, error,
 * and the response `data`.
 *
 * The provided async function (`apiFn`) must accept an options object as its last argument
 * and forward the `signal` from the `AbortController` for proper cancellation behavior.
 *
 * @template {(...args: any[]) => Promise<any>} Fn
 * @param {Fn} apiFn - The async function to invoke. It must accept an `options` object
 *                     as the final parameter and utilize the `signal` for cancellation.
 * @param {Object} [opts] - Optional configuration.
 * @param {(data: Awaited<ReturnType<Fn>>) => void} [opts.onSuccess] - Called on successful response.
 * @param {(err: unknown) => void} [opts.onError] - Called when the request fails (excluding aborts).
 *
 * @returns {{
 *   run: (...args: Parameters<Fn>) => Promise<ReturnType<Fn>>,
 *   isLoading: boolean,
 *   isSuccess: boolean,
 *   error: string | null,
 *   data: Awaited<ReturnType<Fn>> | null
 * }} An object containing:
 *   - `run`: Function to trigger the async request.
 *   - `isLoading`: Whether the request is currently in progress.
 *   - `isSuccess`: Whether the last request completed successfully.
 *   - `error`: Error message if the request failed, or `null`.
 *   - `data`: The most recent successfully returned data, or `null`.
 *
 * @example
 * const { run: fetchUser, isLoading, error, data } = useAsyncRequest(getUserById, {
 *   onSuccess: user => console.log("Loaded user:", user),
 *   onError: err => console.error("Failed to load user:", err),
 * });
 *
 * useEffect(() => {
 *   fetchUser(userId);
 * }, [userId]);
 */
export function useAsyncRequest(apiFn, { onSuccess, onError } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);

  const abortRef = useRef(new AbortController());

  const run = useCallback(
    async (...args) => {
      abortRef.current?.abort(); // Cancel in-flight request
      abortRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const result = await apiFn(...args, {
          signal: abortRef.current.signal,
        });
        setIsSuccess(true);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (err?.name !== "AbortError") {
          const msg = err?.message ?? "An unexpected error occurred";
          setError(msg);
          onError?.(err);
        }
        throw err; // Callers can still .catch if they want
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn, onSuccess, onError],
  );

  useEffect(() => () => abortRef.current.abort("New request initiated"), []);

  return { run, data, isLoading, isSuccess, error };
}
