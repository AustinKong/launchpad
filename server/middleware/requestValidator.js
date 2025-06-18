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

function requestValidator(schema) {
  return function (req, res, next) {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const details = flattenZodErrors(result.error.format());
        return next(new ApiError(400, "Validation failed", details));
      }
      req.body = result.data;
      next();
    } catch (err) {
      next(new ApiError(500, "Internal server error", err.message));
    }
  };
}

export default requestValidator;
