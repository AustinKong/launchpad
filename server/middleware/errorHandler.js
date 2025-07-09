import ApiError from "#utils/ApiError.js";

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof ApiError && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

export default errorHandler;
