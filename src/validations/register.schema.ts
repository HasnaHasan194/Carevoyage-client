import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(25,"last name name not must be more than  100 characters")
      .regex(/^[A-Za-z]+$/, "First name must contain only letters")
      .transform((val) => val.trim()),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(100,"last name name not must be more than  100 characters")
      .regex(/^[A-Za-z]+$/, "Last name must contain only letters")
      .transform((val) => val.trim()),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[a-z]/, "Add a lowercase letter (a–z)")
      .regex(/[A-Z]/, "Add an uppercase letter (A–Z)")
      .regex(/[0-9]/, "Add a number")
      .regex(/[@$!%*?&]/, "Add a symbol (@$!%*?&)"),

    confirmPassword: z.string(),

    phone: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      ),

    role: z.enum(["client", "caretaker", "agency_owner"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
