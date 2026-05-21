import { z } from "zod";

function isValidContactNumber(value: string): boolean {
  const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
  const digitsOnly = value.replace(/\D/g, "");

  return (
    phoneRegex.test(value) && digitsOnly.length >= 7 && digitsOnly.length <= 15
  );
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const contactNumberSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim().length === 0) {
    return null;
  }

  return value;
}, z.union([
  z.string().trim().max(20, "contactNumber must be at most 20 characters").refine(isValidContactNumber, {
    message:
      "contactNumber must be a valid phone number (7–15 digits, optionally formatted with +, spaces, dashes, or parentheses)",
  }),
  z.null(),
]));

const profilePhotoUrlSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim().length === 0) {
    return null;
  }

  return value;
}, z.union([
  z.string().trim().max(255, "profilePhotoUrl must be at most 255 characters").refine(isValidUrl, {
    message: "profilePhotoUrl must be a valid URL starting with http:// or https://",
  }),
  z.null(),
]));

export const patchProfileSchema = z
  .object({
    name: z.string().trim().min(1, "name must be a non-empty string").max(50, "name must be at most 50 characters").optional(),
    contactNumber: contactNumberSchema.optional(),
    profilePhotoUrl: profilePhotoUrlSchema.optional(),
  })
  .strict();

export type PatchProfileDto = z.infer<typeof patchProfileSchema>;