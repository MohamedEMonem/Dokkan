import * as z from "zod";
import { EProductStatus } from "@/types/entities/product.types";

export const productSchema = 
z.object({
  title: z
    .string()
    .min(3, "يجب أن يتكون اسم المنتج من 3 أحرف على الأقل"),
  
  price: z
    .number()
    .min(0, "السعر يجب أن يكون 0 أو أكثر"),
  
  stockQuantity: z
    .number()
    .min(0, "الكمية لا يمكن أن تكون بالسالب"),
  
  categoryId: z
    .string()
    .min(1, "يرجى اختيار القسم الرئيسي"),

  subCategoryId: z
    .string()
    .min(1, "يرجى اختيار القسم الفرعي"),

  description: z.string().optional(),
  
  status: z.nativeEnum(EProductStatus),
});

export type ProductFormData = z.infer<typeof productSchema>;
