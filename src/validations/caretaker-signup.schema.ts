import { z } from "zod";

export const caretakerSignupSchema = z
  .object({
    token: z.string().min(1, "Invalid invitation link"),
    firstName: z
      .string()
      .min(2, "Min 2 characters")
      .regex(/^[A-Za-z]+$/, "Letters only")
      .transform((val) => val.trim()),
    lastName: z
      .string()
      .min(2, "Min 2 characters")
      .regex(/^[A-Za-z]+$/, "Letters only")
      .transform((val) => val.trim()),
    phone: z.string().regex(/^[6-9]\d{9}$/, "10 digits, starts with 6–9"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[a-z]/, "Add a lowercase letter (a–z)")
      .regex(/[A-Z]/, "Add an uppercase letter (A–Z)")
      .regex(/[0-9]/, "Add a number")
      .regex(/[@$!%*?&]/, "Add a symbol (@$!%*?&)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type CaretakerSignupFormData = z.infer<typeof caretakerSignupSchema>;

