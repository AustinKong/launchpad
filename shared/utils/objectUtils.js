/**
 * Deeply merges two objects: `defaults` and `data`.
 *
 * - If a key exists in both objects:
 *   - Arrays are concatenated.
 *   - Nested objects are recursively merged.
 *   - Primitive values from `data` overwrite those in `defaults`.
 * - If types do not match or either input is not an object, `data` is returned as-is.
 *
 * @param {Object} defaults - The default configuration or base object.
 * @param {Object} data - The object to merge into the defaults.
 * @returns {Object} The result of deeply merging `data` into `defaults`.
 *
 * @example
 * const defaults = { a: 1, b: { c: 2 }, d: [3] };
 * const data = { b: { c: 3, d: 4 }, d: [5] };
 * const result = deepMerge(defaults, data);
 * // result: { a: 1, b: { c: 3, d: 4 }, d: [3, 5] }
 */
export function deepMerge(defaults, data) {
  if (
    defaults === null ||
    data === null ||
    typeof defaults !== "object" ||
    typeof data !== "object"
  ) {
    return data;
  }

  const merged = { ...defaults };

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (Array.isArray(data[key]) && Array.isArray(merged[key])) {
        merged[key] = [...merged[key], ...data[key]];
      } else if (typeof data[key] === "object" && typeof merged[key] === "object") {
        merged[key] = deepMerge(merged[key], data[key]);
      } else {
        merged[key] = data[key];
      }
    }
  }

  return merged;
}
