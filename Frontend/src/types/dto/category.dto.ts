import { ICategory } from "@/types/entities/category.types";

/** Create Category DTO */
export type CreateCategoryDTO = Omit<ICategory, "id">;

/** Update Category DTO */
export type UpdateCategoryDTO = { id: string; data: Partial<CreateCategoryDTO> };
