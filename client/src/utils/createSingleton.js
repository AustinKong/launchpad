/**
 * Returns a globally-cached singleton instance, safe across HMR.
 *
 * @template T
 * @param {string} key - A unique global key.
 * @param {() => T} factory - A factory function to create the instance.
 * @returns {T}
 */
export function createSingleton(key, factory) {
  if (!globalThis.__singletons) {
    globalThis.__singletons = {};
  }

  if (!globalThis.__singletons[key]) {
    globalThis.__singletons[key] = factory();
  }

  return globalThis.__singletons[key];
}
