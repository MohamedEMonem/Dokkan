import { z } from "zod";

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
