import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import requestValidator from "#middleware/requestValidator.js";
import { login, registerWithEmail } from "#services/authService.js";
import { z } from "zod";
import { signAccess, signRefresh } from "#utils/jwt.js";

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post(
  "/register",
  requestValidator(registerSchema),
  asyncHandler(function (req, res) {
    const { email, password } = req.body;
    const { user, tokens } = registerWithEmail(email, password);
    setAuthCookies(res, tokens);
    res.status(201).json({ user });
  })
);

router.post(
  "/login",
  requestValidator(loginSchema),
  asyncHandler(async function (req, res) {
    const { email, password } = req.body;
    const { user, tokens } = await login(email, password);
    setAuthCookies(res, tokens);
    res.status(200).json({ user });
  })
);

router.post(
  "/refresh",
  asyncHandler(async function (req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const payload = verifyRefresh(refreshToken);
    const newAccessToken = signAccess({ id: payload.id, email: payload.email });
    const newRefreshToken = signRefresh({
      id: payload.id,
      email: payload.email,
    });

    setAuthCookies(res, {
      access: newAccessToken,
      refresh: newRefreshToken,
    });
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

function setAuthCookies(res, { access, refresh }) {
  res.cookie("accessToken", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3 * 60 * 60 * 1000, // 3 hours
  });
  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export default router;
