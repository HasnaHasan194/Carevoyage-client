import { z } from "zod";

export const agencyRegisterSchema = z
  .object({
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

    email: z.string().email("Invalid email"),

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

    role: z.literal("agency_owner"),

    agencyName: z
      .string()
      .min(2, "Min 2 characters")
      .transform((val) => val.trim()),

    address: z
      .string()
      .min(5, "Min 5 characters")
      .transform((val) => val.trim()),

    registrationNumber: z
      .string()
      .min(3, "Min 3 characters")
      .transform((val) => val.trim()),

    
    description: z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() === ""
          ? undefined
          : val,
      z.string().min(10, "Description must be at least 10 characters").optional()
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
