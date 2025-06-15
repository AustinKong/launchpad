/**
 * Creates a simple key-to-value mapper function using a provided map object.
 *
 * The returned function takes a `key` and:
 * - Returns the corresponding value from the map if the key exists.
 * - Returns the optional `fallback` value if the key is not found.
 *
 * @param {Object} map - An object used as the lookup table.
 * @param {*} [fallback=undefined] - A fallback value returned when the key is not found in the map.
 * @returns {(key: string) => *} A function that maps a key to a value from the map or the fallback.
 *
 * @example
 * const statusMapper = createMapper({ 200: 'OK', 404: 'Not Found' }, 'Unknown');
 * statusMapper(200); // 'OK'
 * statusMapper(500); // 'Unknown'
 */
export function createMapper(map, fallback = undefined) {
  return (key) => (map.hasOwnProperty(key) ? map[key] : fallback);
}
