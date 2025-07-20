/**
 * Converts a lowercase space-separated string to Title Case.
 * Example: "hello world" → "Hello World"
 * @param {string} str - The input string to convert.
 * @returns {string} The string in Title Case format.
 */
export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a slug (hyphen-separated string) to a lowercase space-separated string.
 * Example: "my-blog-post" → "my blog post"
 * @param {string} slug - The slug string to convert.
 * @returns {string} The resulting string with spaces instead of hyphens.
 */
export function slugToText(slug) {
  return slug.split("-").join(" ");
}

/**
 * Safely decodes a URI component.
 * If decoding fails (e.g., due to malformed input), the original string is returned.
 * @param {string} str - The URI component to decode.
 * @returns {string} The decoded string, or the original string if decoding fails.
 */
export function safeDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}
