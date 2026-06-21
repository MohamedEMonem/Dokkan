import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z
    .string()
    .email("صيغة البريد الإلكتروني غير صحيحة"),
  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
