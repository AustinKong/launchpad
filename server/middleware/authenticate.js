import ApiError from "#utils/ApiError";
import { verifyAccess } from "#utils/jwt";

function authenticate(req, res, next) {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  try {
    const payload = verifyAccess(accessToken);
    req.user = payload;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

export default authenticate;
