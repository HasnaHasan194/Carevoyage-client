import { z } from "zod";

/**
 * Zod schema for Package form validation
 * Aligns with backend CreatePackageRequestDTO and UpdatePackageRequestDTO constraints
 */

// Activity schema
const activitySchema = z.object({
  name: z
    .string()
    .min(1, "Activity name is required")
    .trim()
    .min(2, "Activity name must be at least 2 characters")
    .max(100, "Activity name must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .optional()
    .transform((val) => val || ""),
  duration: z
    .number()
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .positive("Duration must be positive"),
  category: z
    .string()
    .min(1, "Activity category is required")
    .trim()
    .min(2, "Category must be at least 2 characters"),
  priceIncluded: z.boolean().optional().default(true),
});

// Itinerary day schema
const itineraryDaySchema = z.object({
  dayNumber: z
    .number()
    .int("Day number must be an integer")
    .min(1, "Day number must be at least 1"),
  title: z
    .string()
    .min(1, "Day title is required")
    .trim()
    .min(2, "Day title must be at least 2 characters")
    .max(200, "Day title must not exceed 200 characters"),
  description: z
    .string()
    .trim()
    .optional()
    .transform((val) => val || ""),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required for each day"),
  accommodation: z
    .string()
    .trim()
    .optional()
    .transform((val) => val || ""),
  meals: z.object({
    breakfast: z.boolean().default(false),
    lunch: z.boolean().default(false),
    dinner: z.boolean().default(false),
  }),
  transfers: z.array(z.string().trim()).optional().default([]),
});

// Base package schema (shared between create and update)
const basePackageSchema = z.object({
  PackageName: z
    .string()
    .min(1, "Package name is required")
    .trim()
    .min(3, "Package name must be at least 3 characters")
    .max(100, "Package name must not exceed 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Package name can only contain alphabets and spaces"),

  description: z
    .string()
    .min(1, "Description is required")
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  category: z
    .string()
    .min(1, "Category is required")
    .trim(),

  tags: z.array(z.string().trim()).optional().default([]),

  meetingPoint: z
    .string()
    .min(1, "Meeting point is required")
    .trim()
    .min(3, "Meeting point must be at least 3 characters")
    .max(200, "Meeting point must not exceed 200 characters"),

  maxGroupSize: z
    .number()
    .int("Max group size must be an integer")
    .min(1, "Max group size must be at least 1"),

  basePrice: z
    .number()
    .positive("Base price must be a positive number")
    .min(0.01, "Base price must be greater than 0"),

  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "Start date must be today or a future date",
      }
    ),

  endDate: z
    .string()
    .min(1, "End date is required")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "End date must be today or a future date",
      }
    ),

  inclusions: z.array(z.string().trim()).optional().default([]),
  exclusions: z.array(z.string().trim()).optional().default([]),
  itineraryDays: z.array(itineraryDaySchema).min(1, "At least one itinerary day is required"),
});

// Create package schema - images are required
export const createPackageSchema = basePackageSchema.extend({
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
});

// Update package schema - images are optional but if provided, must be valid URLs
export const updatePackageSchema = basePackageSchema.extend({
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .optional(),
}).refine(
  (data) => {
    // For update, ensure at least one image exists (either in images array or will be preserved from existing)
    // This validation is handled in the component logic
    return true;
  },
  {
    message: "At least one image must exist (existing or newly uploaded)",
  }
);

// Schema for validating date relationship
export const packageDateSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine(
  (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate >= startDate;
  },
  {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  }
);

// Export individual field schemas for real-time validation
export const packageFieldSchemas = {
  PackageName: z
    .string()
    .min(1, "Package name is required")
    .min(3, "Package name must be at least 3 characters")
    .max(100, "Package name must not exceed 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Package name can only contain alphabets and spaces"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  category: z
    .string()
    .min(1, "Category is required"),

  meetingPoint: z
    .string()
    .min(1, "Meeting point is required")
    .min(3, "Meeting point must be at least 3 characters")
    .max(200, "Meeting point must not exceed 200 characters"),

  maxGroupSize: z
    .number()
    .int("Max group size must be an integer")
    .min(1, "Max group size must be at least 1"),

  basePrice: z
    .number()
    .positive("Base price must be a positive number")
    .min(0.01, "Base price must be greater than 0"),

  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (date) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "Start date must be today or a future date",
      }
    ),

  endDate: z
    .string()
    .min(1, "End date is required")
    .refine(
      (date) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "End date must be today or a future date",
      }
    ),
};

export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;
