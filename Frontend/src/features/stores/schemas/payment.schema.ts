import { z } from "zod";

export const paymentSchema = z.object({
  cardholderName: z
    .string()
    .min(1, "اسم حامل البطاقة مطلوب"),
  cardNumber: z
    .string()
    .min(1, "رقم البطاقة مطلوب")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "رقم البطاقة يجب أن يتكون من 16 رقماً"),
  expiry: z
    .string()
    .min(1, "تاريخ الانتهاء مطلوب")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "تاريخ الانتهاء غير صحيح (MM/YY)"),
  cvc: z
    .string()
    .min(1, "رمز التحقق CVC مطلوب")
    .regex(/^\d{3}$/, "رمز التحقق CVC يجب أن يتكون من 3 أرقام"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
