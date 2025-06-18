import jwt from "jsonwebtoken";
import ApiError from "#utils/ApiError.js";

const ACCESS_TTL = "3h";
const REFRESH_TTL = "7d";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

/**
 * Signs a JWT access token.
 * @param {object} payload
 * @returns {string}
 */
export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TTL });
}

/**
 * Verifies a JWT access token and throws ApiError if invalid.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {ApiError}
 */
export function verifyAccess(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token", err.message);
  }
}

/**
 * Signs a JWT refresh token.
 * @param {object} payload
 * @returns {string}
 */
export function signRefresh(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TTL });
}

/**
 * Verifies a JWT refresh token and throws ApiError if invalid.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {ApiError}
 */
export function verifyRefresh(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token", err.message);
  }
}
