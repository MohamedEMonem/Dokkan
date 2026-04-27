import { z } from "zod";

export const productSchema = z.object({
    
        title: z.string().min(1).max(150),
        description: z.string().optional(),
        price: z.coerce.number().positive("Price must be greater than zero"),
        categoryId: z.coerce.string(),
        storeId: z.coerce.string(),
        stockQuantity: z.coerce.number().int().min(0).optional(),
        images: z.array(z.object({
            imageUrl: z.string().url("Invalid image URL"),
            sortOrder: z.number().int().optional().default(0),
        })).optional(),
        objectName: z.string().optional()
    
});
// partial type for update
export const updateProductSchema = productSchema.partial();

export type CreateProductDto = z.infer<typeof productSchema>;