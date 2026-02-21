import { z } from "zod";

export const createSpecialNeedSchema = z.object({
  name: z
    .string()
    .min(1, "Special need name is required")
    .min(2, "Special need name must be at least 2 characters")
    .max(100, "Special need name must not exceed 100 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Special need name must contain only letters and spaces (no numbers or special characters)"
    )
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, {
      message: "Special need name must be at least 2 characters",
    }),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
});

export type CreateSpecialNeedInput = z.infer<typeof createSpecialNeedSchema>;
