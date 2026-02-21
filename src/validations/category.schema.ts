import { z } from "zod";

/**
 * Category name: letters and spaces only, no numbers or special characters.
 * Min 2, max 50 characters (aligned with backend).
 */
const categoryNameRegex = /^[a-zA-Z\s]+$/;

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters")
    .refine(
      (val) => categoryNameRegex.test(val),
      "Category name can only contain letters and spaces (no numbers or special characters)"
    ),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
