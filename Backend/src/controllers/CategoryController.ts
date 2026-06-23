import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.js";
import { sendError, sendNotFound, sendSuccess, sendValidationError } from "../utils/response.js";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "name is required").max(100, "name must be at most 100 characters"),
  parentCategoryId: z.string().uuid().optional().nullable(),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "name must be a non-empty string").max(100, "name must be at most 100 characters").optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
});

const listCategoriesQuerySchema = z.object({
  parentCategoryId: z.string().uuid().optional(),
});

type CategoryRecord = {
  id: string;
  name: string;
  [key: string]: unknown;
};

type SubCategoryRecord = CategoryRecord & {
  categoryId: string;
};

const normalizeCategory = (category: CategoryRecord, kind: "Category" | "SubCategory", parentCategoryId: string | null = null) => ({
  ...category,
  kind,
  parentCategoryId,
  name: typeof category.name === "string" ? category.name.trimEnd() : category.name,
});

const findCategoryRecord = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (category) {
    return { kind: "Category" as const, record: category as CategoryRecord };
  }

  const subCategory = await prisma.subCategory.findUnique({
    where: { id },
  });

  if (subCategory) {
    return { kind: "SubCategory" as const, record: subCategory as SubCategoryRecord };
  }

  return null;
};

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = listCategoriesQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { parentCategoryId } = validation.data;

    if (parentCategoryId) {
      const categories = await prisma.subCategory.findMany({
        where: {
          categoryId: parentCategoryId,
        },
        orderBy: { name: "asc" },
      });

      return sendSuccess(
        res,
        categories.map((category) => normalizeCategory(category as SubCategoryRecord, "SubCategory", category.categoryId)),
        "Categories retrieved successfully",
      );
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { subCategories: { orderBy: { name: "asc" } } },
    });

    const nested = categories.map((cat) => ({
      ...normalizeCategory(cat as CategoryRecord, "Category", null),
      subCategories: (cat as any).subCategories.map((sc: SubCategoryRecord) => normalizeCategory(sc, "SubCategory", sc.categoryId)),
    }));

    return sendSuccess(res, nested, "Categories retrieved successfully");
  } catch (error) {
    return next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const categoryRecord = await findCategoryRecord(id);

    if (!categoryRecord) {
      return sendNotFound(res, "Category not found");
    }

    return sendSuccess(
      res,
      normalizeCategory(
        categoryRecord.record,
        categoryRecord.kind,
        categoryRecord.kind === "SubCategory" ? (categoryRecord.record as SubCategoryRecord).categoryId : null,
      ),
      "Category retrieved successfully",
    );
  } catch (error) {
    return next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { name, parentCategoryId } = validation.data;

    if (parentCategoryId) {
      const parent = await prisma.category.findUnique({
        where: {
          id: parentCategoryId,
        },
      });

      if (!parent) {
        return sendNotFound(res, "Parent category not found");
      }

      const subCategory = await prisma.subCategory.create({
        data: {
          name,
          categoryId: parentCategoryId,
        },
      });

      return sendSuccess(res, normalizeCategory(subCategory as SubCategoryRecord, "SubCategory", parentCategoryId), "Category created successfully", 201);
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return sendSuccess(res, normalizeCategory(category as CategoryRecord, "Category"), "Category created successfully", 201);
  } catch (error) {
    return next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    const existingSubCategory = existingCategory
      ? null
      : await prisma.subCategory.findUnique({
          where: { id },
        });

    if (!existingCategory && !existingSubCategory) {
      return sendNotFound(res, "Category not found");
    }

    const validation = updateCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const data: { name?: string; categoryId?: string } = {};

    if (validation.data.name !== undefined) {
      data.name = validation.data.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(validation.data, "parentCategoryId")) {
      const parentCategoryId = validation.data.parentCategoryId ?? null;

      if (existingCategory) {
        if (parentCategoryId !== null) {
          return sendError(res, "Top-level categories cannot be re-parented. Create a subcategory instead.", 400);
        }
      } else if (existingSubCategory) {
        if (parentCategoryId === null) {
          return sendError(res, "Subcategories must belong to a category", 400);
        }

        const parent = await prisma.category.findUnique({
          where: {
            id: parentCategoryId,
          },
        });

        if (!parent) {
          return sendNotFound(res, "Parent category not found");
        }

        data.categoryId = parentCategoryId;
      }
    }

    if (Object.keys(data).length === 0) {
      return sendError(res, "No valid fields provided for update", 400);
    }

    if (existingCategory) {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data,
      });

      return sendSuccess(res, normalizeCategory(updatedCategory as CategoryRecord, "Category"), "Category updated successfully");
    }

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data,
    });

    return sendSuccess(
      res,
      normalizeCategory(updatedSubCategory as SubCategoryRecord, "SubCategory", (updatedSubCategory as SubCategoryRecord).categoryId),
      "Category updated successfully",
    );
  } catch (error) {
    return next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Category id is required", 400);
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    const existingSubCategory = existingCategory
      ? null
      : await prisma.subCategory.findUnique({
          where: { id },
        });

    if (!existingCategory && !existingSubCategory) {
      return sendNotFound(res, "Category not found");
    }

    if (existingCategory) {
      const [childrenCount, productCount] = await Promise.all([
        prisma.subCategory.count({
          where: {
            categoryId: id,
          },
        }),
        prisma.product.count({
          where: {
            subCategoryId: id,
            deletedAt: null,
          },
        }),
      ]);

      if (childrenCount > 0) {
        return sendError(res, "Category has subcategories and cannot be deleted", 409);
      }

      if (productCount > 0) {
        return sendError(res, "Category has products and cannot be deleted", 409);
      }

      await prisma.category.delete({ where: { id } });
      return sendSuccess(res, null, "Category deleted successfully");
    }

    const productCount = await prisma.product.count({
      where: {
        subCategoryId: id,
        deletedAt: null,
      },
    });

    if (productCount > 0) {
      return sendError(res, "Subcategory has products and cannot be deleted", 409);
    }

    await prisma.subCategory.delete({ where: { id } });

    return sendSuccess(res, null, "Category deleted successfully");
  } catch (error) {
    return next(error);
  }
};