/**
 * Returns elements present in the `updated` array but not in the `original` array.
 *
 * @param {string[] | number[]} original - The original array of IDs.
 * @param {string[] | number[]} updated - The updated array of IDs.
 * @returns {Array} Array of IDs that have been added.
 */
export function getAddedElements(original, updated) {
  const originalSet = new Set(original);
  return updated.filter((id) => !originalSet.has(id));
}

/**
 * Returns elements present in the `original` array but not in the `updated` array.
 *
 * @param {string[] | number[]} original - The original array of IDs.
 * @param {string[] | number[]} updated - The updated array of IDs.
 * @returns {Array} Array of IDs that have been removed.
 */
export function getRemovedElements(original, updated) {
  const updatedSet = new Set(updated);
  return original.filter((id) => !updatedSet.has(id));
}
