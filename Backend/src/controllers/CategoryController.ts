import type { Request, Response } from "express";
import prisma from "../config/db.js";
import { sendError, sendNotFound, sendServerError, sendSuccess, sendValidationError } from "../utils/response.js";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "name is required").max(100, "name must be at most 100 characters"),
  parentCategoryId: z.string().uuid().optional().nullable(),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "name must be a non-empty string").max(100, "name must be at most 100 characters").optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
});

const normalizeCategory = (category: { [key: string]: unknown }) => ({
  ...category,
  name: typeof category.name === "string" ? category.name.trimEnd() : category.name,
});

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ parentCategoryId: "asc" }, { name: "asc" }],
    });

    return sendSuccess(res, categories.map(normalizeCategory), "Categories retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve categories", error);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return sendNotFound(res, "Category not found");
    }

    return sendSuccess(res, normalizeCategory(category), "Category retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve category", error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { name, parentCategoryId } = validation.data;

    if (parentCategoryId) {
      const parent = await prisma.category.findUnique({ where: { id: parentCategoryId } });
      if (!parent) {
        return sendNotFound(res, "Parent category not found");
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        parentCategoryId: parentCategoryId ?? null,
      },
    });

    return sendSuccess(res, normalizeCategory(category), "Category created successfully", 201);
  } catch (error) {
    return sendServerError(res, "Failed to create category", error);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return sendNotFound(res, "Category not found");
    }

    const validation = updateCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const data: { name?: string; parentCategoryId?: string | null } = {};

    if (validation.data.name !== undefined) {
      data.name = validation.data.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(validation.data, "parentCategoryId")) {
      const parentCategoryId = validation.data.parentCategoryId ?? null;

      if (parentCategoryId === id) {
        return sendError(res, "Category cannot be its own parent", 400);
      }

      if (parentCategoryId !== null) {
        const parent = await prisma.category.findUnique({ where: { id: parentCategoryId } });
        if (!parent) {
          return sendNotFound(res, "Parent category not found");
        }

        let ancestorId: string | null = parent.parentCategoryId;
        while (ancestorId !== null) {
          if (ancestorId === id) {
            return sendError(res, "Category cannot be moved under its own descendant", 400);
          }

          const ancestor = await prisma.category.findUnique({
            where: { id: ancestorId },
            select: { parentCategoryId: true },
          });

          ancestorId = ancestor?.parentCategoryId ?? null;
        }
      }

      data.parentCategoryId = parentCategoryId;
    }

    if (Object.keys(data).length === 0) {
      return sendError(res, "No valid fields provided for update", 400);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    return sendSuccess(res, normalizeCategory(updatedCategory), "Category updated successfully");
  } catch (error) {
    return sendServerError(res, "Failed to update category", error);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return sendNotFound(res, "Category not found");
    }

    const [childrenCount, productCount] = await Promise.all([
      prisma.category.count({ where: { parentCategoryId: id } }),
      prisma.product.count({ where: { categoryId: id, deletedAt: null } }),
    ]);

    if (childrenCount > 0) {
      return sendError(res, "Category has subcategories and cannot be deleted", 409);
    }

    if (productCount > 0) {
      return sendError(res, "Category has products and cannot be deleted", 409);
    }

    await prisma.category.delete({ where: { id } });

    return sendSuccess(res, null, "Category deleted successfully");
  } catch (error) {
    return sendServerError(res, "Failed to delete category", error);
  }
};