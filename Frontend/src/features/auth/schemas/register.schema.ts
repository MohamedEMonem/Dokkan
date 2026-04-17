import { z } from "zod";

export const registerSchema = z
  .object({
    role: z.enum(["Customer", "StoreOwner"]),

    name: z
      .string()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل"),

    email: z
      .email("صيغة البريد الإلكتروني غير صحيحة"),

    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),

    confirmPassword: z.string(),

    terms: z.boolean().refine((value) => value === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
