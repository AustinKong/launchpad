/**
 * Represents an HTTP error that can be thrown in request handling.
 */
class ApiError extends Error {
  /**
   * Create a new ApiError.
   * @param {number} statusCode - The HTTP status code to return (e.g., 400, 401, 500).
   * @param {string} message - A human-readable error message.
   * @param {object|null} [details=null] - Optional additional error details (e.g., validation errors).
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
