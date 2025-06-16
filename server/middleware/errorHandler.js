import ApiError from "../errors/ApiError.js";

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

export default errorHandler;
