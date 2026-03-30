import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[a-z]/, "Add a lowercase letter (a–z)")
    .regex(/[A-Z]/, "Add an uppercase letter (A–Z)")
    .regex(/[0-9]/, "Add a number")
    .regex(/[@$!%*?&]/, "Add a symbol (@$!%*?&)"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

