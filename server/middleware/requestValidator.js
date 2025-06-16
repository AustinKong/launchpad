import ApiError from "../utils/ApiError";

function requestValidator(schema) {
  return function (req, res, next) {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        next(new ApiError(400, "Validation failed", result.error.format()));
      }
      req.body = result.data;
      next();
    } catch (err) {
      next(new ApiError(500, "Internal server error", err.message));
    }
  };
}

export default requestValidator;
