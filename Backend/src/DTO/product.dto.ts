import { z } from "zod";

export const listProductsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.enum(["Active", "Inactive"]).optional(),
    sortBy: z.enum(["createdAt", "title", "price"]).optional().default("createdAt"),
    sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
    storeId: z.string().optional(),
});

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

export type ListProductsQueryDto = z.infer<typeof listProductsQuerySchema>;
export type CreateProductDto = z.infer<typeof productSchema>;