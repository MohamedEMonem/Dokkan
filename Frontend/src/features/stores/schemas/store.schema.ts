import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المتجر مطلوب"),
  description: z.string().optional(),
  subdomain: z
    .string()
    .min(1, "النطاق الفرعي مطلوب")
    .regex(/^[a-zA-Z0-9-]+$/, "النطاق الفرعي يجب أن يحتوي على أحرف إنجليزية وأرقام وعلامة (-) فقط"),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
