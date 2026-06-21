import { z } from "zod";

export const businessSchema = z.object({
  address: z.string().optional(),
  taxId: z
    .string()
    .min(1, "الرقم الضريبي مطلوب")
    .regex(/^\d{9}$/, "الرقم الضريبي يجب أن يكون مكوناً من 9 أرقام"),
  phone: z.string().optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
