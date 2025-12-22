import { z } from "zod";

export const agencyRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .regex(/^[A-Za-z]+$/, "First name must contain only letters")
      .transform((val) => val.trim()),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[A-Za-z]+$/, "Last name must contain only letters")
      .transform((val) => val.trim()),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),

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
      .min(2, "Agency name must be at least 2 characters")
      .transform((val) => val.trim()),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .transform((val) => val.trim()),

    registrationNumber: z
      .string()
      .min(3, "Registration number is required")
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
    message: "Passwords do not match",
  });
