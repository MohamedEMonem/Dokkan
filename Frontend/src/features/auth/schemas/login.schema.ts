import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("صيغة البريد الإلكتروني غير صحيحة"),

  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),

  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
