import { z } from "zod";

// ─── Constants ─────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const ImageSchema = z
  .instanceof(File, { message: "يجب اختيار ملف صورة صحيح" })
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "صيغة الصورة غير مدعومة. الصيغ المدعومة هي: JPEG, PNG, GIF, WebP"
  )
  .refine((file) => file.size <= MAX_FILE_SIZE, `حجم الصورة يجب ألا يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`);


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

