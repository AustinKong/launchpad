import { z } from "zod";

export const registerSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};
