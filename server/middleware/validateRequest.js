import ApiError from "#utils/ApiError.js";

function flattenZodErrors(error) {
  const flattened = {};
  for (const [field, errorObj] of Object.entries(error)) {
    if (field === "_errors") continue;
    const message = errorObj._errors?.[0];
    if (message) {
      flattened[field] = message;
    }
  }
  return flattened;
}

/**
 * Middleware to validate request parts using Zod schemas.
 * @param {Object} schema - Validation schemas
 * @param {ZodSchema} [schema.body] - Schema for req.body
 * @param {ZodSchema} [schema.params] - Schema for req.params
 * @param {ZodSchema} [schema.query] - Schema for req.query
 * @param {ZodSchema} [schema.cookies] - Schema for req.cookies
 * @returns {RequestHandler} Middleware
 */
function validateRequest({ body, params, query, cookies }) {
  return function (req, res, next) {
    try {
      if (body) {
        const result = body.safeParse(req.body);
        if (!result.success) {
          const details = flattenZodErrors(result.error.format());
          return next(new ApiError(400, "Body validation failed", details));
        }
        req.body = result.data;
      }

      if (params) {
        const result = params.safeParse(req.params);
        if (!result.success) {
          const details = flattenZodErrors(result.error.format());
          return next(
            new ApiError(400, "URL params validation failed", details)
          );
        }
        req.params = result.data;
      }

      if (query) {
        const result = query.safeParse(req.query);
        if (!result.success) {
          const details = flattenZodErrors(result.error.format());
          return next(new ApiError(400, "Query validation failed", details));
        }

        // In Express 5.x, req.query is immutable and cannot be reassigned.
        // To keep req.body, req.params, and req.query behaviour consistent, we overwrite its properties directly.
        // If any code depends on req.query being a frozen or read-only object, this could break that assumption.
        try {
          Object.keys(req.query).forEach((key) => delete req.query[key]);
          Object.assign(req.query, result.data);
        } catch (err) {
          return next(
            new ApiError(500, "Failed to assign validated query data", err)
          );
        }
      }

      if (cookies) {
        const result = cookies.safeParse(req.cookies);
        if (!result.success) {
          const details = flattenZodErrors(result.error.format());
          return next(new ApiError(400, "Cookie validation failed", details));
        }
        req.cookies = result.data;
      }

      next();
    } catch (err) {
      next(new ApiError(500, "Internal server error", err.message));
    }
  };
}

export default validateRequest;
