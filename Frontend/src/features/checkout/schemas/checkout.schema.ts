import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().trim().min(1, "العنوان بالتفصيل مطلوب"),
  city: z.string().trim().min(1, "المدينة مطلوبة"),
  governorate: z.string().trim().min(1, "اختر المحافظة"),
});

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(1, "الاسم الكامل مطلوب"),
    email: z.string().trim().email("بريد إلكتروني صالح مطلوب"),
    phone: z.string().trim().min(1, "رقم الهاتف مطلوب"),
    address: addressSchema,
    paymentMethod: z.enum(["cod", "stripe"]),
    cardholderName: z.string(),
    cardNumber: z.string(),
    expiryDate: z.string(),
    cvv: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.paymentMethod !== "stripe") {
      return;
    }

    if (!value.cardholderName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardholderName"],
        message: "اسم حامل البطاقة مطلوب",
      });
    }

    if (value.cardNumber.replace(/\s+/g, "").length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message: "رقم بطاقة صالح مطلوب",
      });
    }

    if (!value.expiryDate.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "تاريخ الانتهاء مطلوب",
      });
    }

    if (value.cvv.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cvv"],
        message: "رمز CVV مطلوب",
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type CheckoutAddress = z.infer<typeof addressSchema>;
