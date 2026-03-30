import { z } from "zod";

export const verifyOldPasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old password is required"),
});

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[a-z]/, "Add a lowercase letter (a–z)")
      .regex(/[A-Z]/, "Add an uppercase letter (A–Z)")
      .regex(/[0-9]/, "Add a number")
      .regex(/[@$!%*?&]/, "Add a symbol (@$!%*?&)"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password must be same",
  });

