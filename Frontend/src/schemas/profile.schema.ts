import { z } from "zod";
import { ImageSchema } from "./image.schema";

/** Mirrors backend patchProfileSchema validation rules */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "الاسم لا يمكن أن يكون فارغاً")
    .max(50, "الاسم يجب ألا يتجاوز 50 حرفاً")
    .optional(),

  contactNumber: z
    .string()
    .trim()
    .max(20, "رقم الهاتف يجب ألا يتجاوز 20 حرفاً")
    .refine(
      (value) => {
        if (value === "") return true; // treated as null/cleared by backend
        const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
        const digitsOnly = value.replace(/\D/g, "");
        return (
          phoneRegex.test(value) &&
          digitsOnly.length >= 7 &&
          digitsOnly.length <= 15
        );
      },
      {
        message:
          "رقم الهاتف غير صحيح (7–15 رقماً، يمكن استخدام +، مسافات، شرطات، أو أقواس)",
      }
    )
    .optional()
    .or(z.literal("")),

  image: ImageSchema.optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

