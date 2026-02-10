import { z } from "zod";

/**
 * Zod schema for Agency Profile form validation
 * Aligns with backend UpdateAgencyProfileRequestDTO constraints
 */
export const agencyProfileSchema = z.object({
  agencyName: z
    .string()
    .min(1, "Company name is required")
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^[0-9]{10,15}$/.test(val.trim()),
      { message: "Phone number must be 10-15 digits only" }
    )
    .transform((val) => val?.trim() || ""),

  address: z
    .string()
    .min(1, "Address is required")
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must not exceed 300 characters"),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .default(""),

  profileImage: z.string().optional(),
});

export const agencyProfileImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
});

export type AgencyProfileFormData = z.infer<typeof agencyProfileSchema>;
