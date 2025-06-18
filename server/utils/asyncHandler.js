/**
 * Wraps an async route handler and forwards any thrown errors to the Express error handler.
 * @param {function(Request, Response, NextFunction): Promise<any>} fn - The async route handler to wrap.
 * @returns {function(Request, Response, NextFunction): void} A new function that handles errors automatically.
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
