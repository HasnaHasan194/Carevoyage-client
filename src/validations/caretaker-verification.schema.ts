import { z } from "zod";

const phoneRegex = /^\d{10}$/;
const alphabetRegex = /^[A-Za-z\s]+$/;
const alphabetOnlyRegex = /^[A-Za-z]+$/;

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(alphabetOnlyRegex, "First name must contain only letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(alphabetOnlyRegex, "Last name must contain only letters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(phoneRegex, "Phone number must be exactly 10 digits"),
  alternatePhone: z
    .string()
    .regex(phoneRegex, "Alternate phone must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  dob: z
    .string()
    .refine((val) => {
      const age = calculateAge(val);
      return age >= 18;
    }, "Age must be at least 18 years"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .regex(alphabetRegex, "Nationality must contain only letters"),
});

export const addressInfoSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .regex(alphabetRegex, "City must contain only letters"),
  state: z
    .string()
    .min(1, "State is required")
    .regex(alphabetRegex, "State must contain only letters"),
  country: z
    .string()
    .min(1, "Country is required")
    .regex(alphabetRegex, "Country must contain only letters"),
  postalCode: z
    .string()
    .regex(/^\d+$/, "Pin code must be numeric")
    .min(4, "Pin code must be at least 4 digits")
    .max(10, "Pin code must not exceed 10 digits"),
});

export const professionalInfoSchema = z.object({
  experienceYears: z
    .number()
    .min(0, "Experience years must be at least 0")
    .max(50, "Experience years must not exceed 50"),
  languages: z
    .array(
      z.string().regex(alphabetRegex, "Language must contain only letters")
    )
    .min(1, "At least one language is required"),
  professionalBio: z
    .string()
    .min(50, "Professional bio must be at least 50 characters")
    .max(500, "Professional bio must not exceed 500 characters"),
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
  .refine(
    (file) =>
      ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      ),
    "File must be PDF, JPG, or PNG"
  );

export const documentsSchema = z.object({
  caretakerLicense: fileSchema,
  governmentIdProof: fileSchema,
  firstAidCertificate: fileSchema,
});

export const verificationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  addressInfo: addressInfoSchema,
  professionalInfo: professionalInfoSchema,
  documents: documentsSchema,
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressInfoFormData = z.infer<typeof addressInfoSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type DocumentsFormData = z.infer<typeof documentsSchema>;
export type VerificationFormData = z.infer<typeof verificationFormSchema>;


