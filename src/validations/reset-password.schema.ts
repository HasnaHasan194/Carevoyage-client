import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Min 8 characters")
      .max(100,"last name name not must be more than  100 characters")
      .regex(/[a-z]/, "Add a lowercase letter (a–z)")
      .regex(/[A-Z]/, "Add an uppercase letter (A–Z)")
      .regex(/[0-9]/, "Add a number")
      .regex(/[@$!%*?&]/, "Add a symbol (@$!%*?&)"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });








