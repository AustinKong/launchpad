import bcrypt from "bcrypt";
import prisma from "#prisma/prismaClient.js";
import ApiError from "#utils/ApiError.js";
import { signAccess, signRefresh } from "#utils/jwt.js";

export async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    tokens: {
      accessToken: signAccess(payload),
      refreshToken: signRefresh(payload),
    },
  };
}

export async function registerWithEmail(email, password) {
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        providerAccountId: null,
        authMethod: "EMAIL",
      },
    });

    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      tokens: {
        accessToken: signAccess(payload),
        refreshToken: signRefresh(payload),
      },
    };
  } catch (err) {
    if (err.code === "P2002") {
      throw new ApiError(400, "User already exists with this email");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function registerWithGoogle(email, providerAccountId) {
  // Stub
  throw new ApiError(501, "Google registration not implemented yet");
}
