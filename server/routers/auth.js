import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import { registerSchema, loginSchema } from "#schemas/auth.js";
import {
  login,
  registerWithEmail,
  refreshTokens,
} from "#services/authService.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(async function (req, res) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await registerWithEmail({
      email,
      password,
    });

    setAuthCookies(res, { accessToken, refreshToken });
    res.sendStatus(201);
  })
);

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(async function (req, res) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await login({ email, password });

    setAuthCookies(res, { accessToken, refreshToken });
    res.sendStatus(200);
  })
);

router.post(
  "/refresh",
  asyncHandler(async function (req, res) {
    const oldRefreshToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken } = await refreshTokens({
      oldRefreshToken,
    });

    setAuthCookies(res, { accessToken, refreshToken });
    res.sendStatus(200);
  })
);

router.post(
  "/logout",
  asyncHandler(function (req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  })
);

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    path: "/",
    maxAge: 3 * 60 * 60 * 1000, // 3 hours
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    path: "/", // FIXME: Cookie will not be supplied if set to "/auth/refresh", not sure if this has to do with vite's api/ proxy
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export default router;
