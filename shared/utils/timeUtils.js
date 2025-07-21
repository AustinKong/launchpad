/**
 * Returns a human-readable string representing the time difference
 * between now and the provided date, in phrases like:
 * - "less than a minute"
 * - "x minutes"
 * - "x hours"
 * - "x days"
 * - "a long time"
 *
 * @param {Date | string | number} dateInput - The date to compare to now. Accepts a `Date` object, ISO string, or timestamp.
 * @returns {string} A human-readable string describing how long ago the input date was.
 *
 * @example
 * timeSinceNow(new Date(Date.now() - 45 * 1000)); // "less than a minute"
 * timeSinceNow("2023-07-01T12:00:00Z"); // "x days"
 * timeSinceNow(1690000000000); // "a long time"
 */
export function timeSinceNow(dateInput) {
  const now = new Date();
  const date = new Date(dateInput);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "less than a minute";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute" : `${diffInMinutes} minutes`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour" : `${diffInHours} hours`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 29) {
    return diffInDays === 1 ? "1 day" : `${diffInDays} days`;
  }

  return "a long time";
}
