import { useEffect, useRef } from "react";

/**
 * Repeatedly runs a callback every `delay` milliseconds.
 * Optionally flushes the callback on component unmount and/or page unload.
 *
 * @param {() => void} callback - The main function to execute on each interval.
 * @param {() => void | null} [unloadCallback=null] - Optional synchronous function to run before the page unloads (e.g., sendBeacon).
 * @param {number|null} [delay=5000] - Interval time in milliseconds. Pass `null` to pause the interval.
 * @param {boolean} [triggerOnUnmount=false] - Whether to call the main callback once when the component unmounts.
 */
export function useInterval(
  callback,
  unloadCallback = null,
  delay = 5000,
  triggerOnUnmount = false,
) {
  const savedCallback = useRef(callback);
  const savedUnloadCallback = useRef(unloadCallback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    savedUnloadCallback.current = unloadCallback;
  }, [unloadCallback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (triggerOnUnmount) {
        savedCallback.current();
      }
    };
  }, [triggerOnUnmount]);

  useEffect(() => {
    if (!savedUnloadCallback.current) return;

    const handleBeforeUnload = () => {
      savedUnloadCallback.current?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}
