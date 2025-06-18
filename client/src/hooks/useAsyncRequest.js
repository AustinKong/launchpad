import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps an async service-layer function and gives you:
 *   - an imperative `run()` callback that injects an AbortSignal
 *   - reactive `isLoading`, `isSuccess`, `error` state
 *   - optional `onSuccess` / `onError` side-effect hooks
 *
 * @template {(...args: any[]) => Promise<any>} Fn
 * @param {Fn} apiFn - The promise-returning service function. It **must** accept
 *                     an `options` object as its last argument and pass it through to `fetch`.
 * @param {Object} [opts]
 * @param {(data: Awaited<ReturnType<Fn>>) => void} [opts.onSuccess]
 * @param {(err: unknown) => void} [opts.onError]
 *
 * @returns {{
 *   run: (...args: Parameters<Fn>) => Promise<ReturnType<Fn>>,
 *   isLoading: boolean,
 *   isSuccess: boolean,
 *   error: string | null
 * }}
 *
 * @example
 * const { run: getUser, isLoading, error } = useAsyncRequest(getUserById, {
 *   onSuccess: user => toast.success(`Fetched ${user.name}`),
 *   onError: err => toast.error(err.message)
 * });
 *
 * useEffect(() => { getUser(id); }, [id]);
 */
export function useAsyncRequest(apiFn, { onSuccess, onError } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const abortRef = useRef(new AbortController());

  const run = useCallback(
    async (...args) => {
      abortRef.current?.abort(); // Cancel in-flight request
      abortRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const data = await apiFn(...args, {
          signal: abortRef.current.signal,
        });
        setIsSuccess(true);
        onSuccess?.(data);
        return data;
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

  useEffect(() => () => abortRef.current.abort(), []);

  return { run, isLoading, isSuccess, error };
}
