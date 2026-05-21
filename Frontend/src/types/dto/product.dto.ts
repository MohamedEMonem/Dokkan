import { IProduct } from "@/types/entities/product.types";

/** Create Product DTO */
export type CreateProductDTO = Omit<IProduct, "id" | "createdAt" | "updatedAt" | "deletedAt">;

/** Update Product DTO */
export type UpdateProductDTO = { id: string; data: Partial<CreateProductDTO> };
